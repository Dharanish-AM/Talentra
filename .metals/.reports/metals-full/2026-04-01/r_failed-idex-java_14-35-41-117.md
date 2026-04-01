error id: jar:file://<HOME>/.m2/repository/org/springframework/security/spring-security-config/6.2.3/spring-security-config-6.2.3-sources.jar!/org/springframework/security/config/web/server/OidcBackChannelServerLogoutHandler.java
file://<WORKSPACE>/jar:file:<HOME>/.m2/repository/org/springframework/security/spring-security-config/6.2.3/spring-security-config-6.2.3-sources.jar!/org/springframework/security/config/web/server/OidcBackChannelServerLogoutHandler.java
### java.lang.RuntimeException: Broken file, quote doesn't end.

Java indexer failed with and exception.
```Java
/*
 * Copyright 2002-2024 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.springframework.security.config.web.server;

import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.oidc.authentication.logout.OidcLogoutToken;
import org.springframework.security.oauth2.client.oidc.server.session.InMemoryReactiveOidcSessionRegistry;
import org.springframework.security.oauth2.client.oidc.server.session.ReactiveOidcSessionRegistry;
import org.springframework.security.oauth2.client.oidc.session.OidcSessionInformation;
import org.springframework.security.oauth2.client.oidc.session.OidcSessionRegistry;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.web.server.WebFilterExchange;
import org.springframework.security.web.server.authentication.logout.ServerLogoutHandler;
import org.springframework.util.Assert;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * A {@link ServerLogoutHandler} that locates the sessions associated with a given OIDC
 * Back-Channel Logout Token and invalidates each one.
 *
 * @author Josh Cummings
 * @since 6.2
 * @see <a target="_blank" href=
 * "https://openid.net/specs/openid-connect-backchannel-1_0.html">OIDC Back-Channel Logout
 * Spec</a>
 */
final class OidcBackChannelServerLogoutHandler implements ServerLogoutHandler {

	private final Log logger = LogFactory.getLog(getClass());

	private ReactiveOidcSessionRegistry sessionRegistry = new InMemoryReactiveOidcSessionRegistry();

	private WebClient web = WebClient.create();

	private String logoutEndpointName = "/logout";

	private String sessionCookieName = "SESSION";

	@Override
	public Mono<Void> logout(WebFilterExchange exchange, Authentication authentication) {
		if (!(authentication instanceof OidcBackChannelLogoutAuthentication token)) {
			return Mono.defer(() -> {
				if (this.logger.isDebugEnabled()) {
					String message = "Did not perform OIDC Back-Channel Logout since authentication [%s] was of the wrong type";
					this.logger.debug(String.format(message, authentication.getClass().getSimpleName()));
				}
				return Mono.empty();
			});
		}
		AtomicInteger totalCount = new AtomicInteger(0);
		AtomicInteger invalidatedCount = new AtomicInteger(0);
		return this.sessionRegistry.removeSessionInformation(token.getPrincipal()).concatMap((session) -> {
			totalCount.incrementAndGet();
			return eachLogout(exchange, session).flatMap((response) -> {
				invalidatedCount.incrementAndGet();
				return Mono.empty();
			}).onErrorResume((ex) -> {
				this.logger.debug("Failed to invalidate session", ex);
				return this.sessionRegistry.saveSessionInformation(session).then(Mono.just(ex.getMessage()));
			});
		}).collectList().flatMap((list) -> {
			if (this.logger.isTraceEnabled()) {
				this.logger.trace(String.format("Invalidated %d out of %d sessions", invalidatedCount.intValue(),
						totalCount.intValue()));
			}
			if (!list.isEmpty()) {
				return handleLogoutFailure(exchange.getExchange().getResponse(), oauth2Error(list));
			}
			else {
				return Mono.empty();
			}
		});
	}

	private Mono<ResponseEntity<Void>> eachLogout(WebFilterExchange exchange, OidcSessionInformation session) {
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.COOKIE, this.sessionCookieName + "=" + session.getSessionId());
		for (Map.Entry<String, String> credential : session.getAuthorities().entrySet()) {
			headers.add(credential.getKey(), credential.getValue());
		}
		String logout = computeLogoutEndpoint(exchange);
		return this.web.post().uri(logout).headers((h) -> h.putAll(headers)).retrieve().toBodilessEntity();
	}

	String computeLogoutEndpoint(WebFilterExchange exchange) {
		String url = exchange.getExchange().getRequest().getURI().toString();
		return UriComponentsBuilder.fromHttpUrl(url)
			.host("localhost")
			.replacePath(this.logoutEndpointName)
			.build()
			.toUriString();
	}

	private OAuth2Error oauth2Error(Collection<?> errors) {
		return new OAuth2Error("partial_logout", "not all sessions were terminated: " + errors,
				"https://openid.net/specs/openid-connect-backchannel-1_0.html#Validation");
	}

	private Mono<Void> handleLogoutFailure(ServerHttpResponse response, OAuth2Error error) {
		response.setRawStatusCode(HttpServletResponse.SC_BAD_REQUEST);
		byte[] bytes = String.format("""
				{
					"error_code": "%s",
					"error_description": "%s",
					"error_uri: "%s"
				}
				""", error.getErrorCode(), error.getDescription(), error.getUri()).getBytes(StandardCharsets.UTF_8);
		DataBuffer buffer = response.bufferFactory().wrap(bytes);
		return response.writeWith(Flux.just(buffer));
	}

	/**
	 * Use this {@link OidcSessionRegistry} to identify sessions to invalidate. Note that
	 * this class uses
	 * {@link OidcSessionRegistry#removeSessionInformation(OidcLogoutToken)} to identify
	 * sessions.
	 * @param sessionRegistry the {@link OidcSessionRegistry} to use
	 */
	void setSessionRegistry(ReactiveOidcSessionRegistry sessionRegistry) {
		Assert.notNull(sessionRegistry, "sessionRegistry cannot be null");
		this.sessionRegistry = sessionRegistry;
	}

	/**
	 * Use this {@link WebClient} to perform the per-session back-channel logout
	 * @param web the {@link WebClient} to use
	 */
	void setWebClient(WebClient web) {
		Assert.notNull(web, "web cannot be null");
		this.web = web;
	}

	/**
	 * Use this logout URI for performing per-session logout. Defaults to {@code /logout}
	 * since that is the default URI for
	 * {@link org.springframework.security.web.authentication.logout.LogoutFilter}.
	 * @param logoutUri the URI to use
	 */
	void setLogoutUri(String logoutUri) {
		Assert.hasText(logoutUri, "logoutUri cannot be empty");
		this.logoutEndpointName = logoutUri;
	}

	/**
	 * Use this cookie name for the session identifier. Defaults to {@code JSESSIONID}.
	 *
	 * <p>
	 * Note that if you are using Spring Session, this likely needs to change to SESSION.
	 * @param sessionCookieName the cookie name to use
	 */
	void setSessionCookieName(String sessionCookieName) {
		Assert.hasText(sessionCookieName, "clientSessionCookieName cannot be empty");
		this.sessionCookieName = sessionCookieName;
	}

}

```


#### Error stacktrace:

```
scala.meta.internal.mtags.JavaToplevelMtags.quotedLiteral$1(JavaToplevelMtags.scala:176)
	scala.meta.internal.mtags.JavaToplevelMtags.parseToken$1(JavaToplevelMtags.scala:230)
	scala.meta.internal.mtags.JavaToplevelMtags.fetchToken(JavaToplevelMtags.scala:264)
	scala.meta.internal.mtags.JavaToplevelMtags.loop(JavaToplevelMtags.scala:75)
	scala.meta.internal.mtags.JavaToplevelMtags.indexRoot(JavaToplevelMtags.scala:43)
	scala.meta.internal.mtags.MtagsIndexer.index(MtagsIndexer.scala:22)
	scala.meta.internal.mtags.MtagsIndexer.index$(MtagsIndexer.scala:21)
	scala.meta.internal.mtags.JavaToplevelMtags.index(JavaToplevelMtags.scala:18)
	scala.meta.internal.mtags.Mtags.extendedIndexing(Mtags.scala:78)
	scala.meta.internal.mtags.SymbolIndexBucket.indexSource(SymbolIndexBucket.scala:133)
	scala.meta.internal.mtags.SymbolIndexBucket.addSourceFile(SymbolIndexBucket.scala:109)
	scala.meta.internal.mtags.SymbolIndexBucket.$anonfun$addSourceJar$2(SymbolIndexBucket.scala:75)
	scala.collection.immutable.List.flatMap(List.scala:283)
	scala.meta.internal.mtags.SymbolIndexBucket.$anonfun$addSourceJar$1(SymbolIndexBucket.scala:71)
	scala.meta.internal.io.PlatformFileIO$.withJarFileSystem(PlatformFileIO.scala:75)
	scala.meta.internal.io.FileIO$.withJarFileSystem(FileIO.scala:33)
	scala.meta.internal.mtags.SymbolIndexBucket.addSourceJar(SymbolIndexBucket.scala:69)
	scala.meta.internal.mtags.OnDemandSymbolIndex.$anonfun$addSourceJar$2(OnDemandSymbolIndex.scala:86)
	scala.meta.internal.mtags.OnDemandSymbolIndex.tryRun(OnDemandSymbolIndex.scala:132)
	scala.meta.internal.mtags.OnDemandSymbolIndex.addSourceJar(OnDemandSymbolIndex.scala:85)
	scala.meta.internal.metals.Indexer.indexJar(Indexer.scala:662)
	scala.meta.internal.metals.Indexer.addSourceJarSymbols(Indexer.scala:647)
	scala.meta.internal.metals.Indexer.processDependencyPath(Indexer.scala:394)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$9(Indexer.scala:454)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$9$adapted(Indexer.scala:426)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterable.foreach(Iterable.scala:936)
	scala.collection.IterableOps$WithFilter.foreach(Iterable.scala:906)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$3(Indexer.scala:426)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$3$adapted(Indexer.scala:424)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterable.foreach(Iterable.scala:936)
	scala.collection.IterableOps$WithFilter.foreach(Iterable.scala:906)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$1(Indexer.scala:424)
	scala.meta.internal.metals.Indexer.$anonfun$indexDependencyModules$1$adapted(Indexer.scala:423)
	scala.collection.IterableOnceOps.foreach(IterableOnce.scala:630)
	scala.collection.IterableOnceOps.foreach$(IterableOnce.scala:628)
	scala.collection.AbstractIterable.foreach(Iterable.scala:936)
	scala.meta.internal.metals.Indexer.indexDependencyModules(Indexer.scala:423)
	scala.meta.internal.metals.Indexer.$anonfun$indexWorkspace$20(Indexer.scala:199)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.meta.internal.metals.TimerProvider.timedThunk(TimerProvider.scala:25)
	scala.meta.internal.metals.Indexer.$anonfun$indexWorkspace$19(Indexer.scala:192)
	scala.meta.internal.metals.Indexer.$anonfun$indexWorkspace$19$adapted(Indexer.scala:188)
	scala.collection.immutable.List.foreach(List.scala:323)
	scala.meta.internal.metals.Indexer.indexWorkspace(Indexer.scala:188)
	scala.meta.internal.metals.Indexer.$anonfun$profiledIndexWorkspace$2(Indexer.scala:58)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.meta.internal.metals.TimerProvider.timedThunk(TimerProvider.scala:25)
	scala.meta.internal.metals.Indexer.$anonfun$profiledIndexWorkspace$1(Indexer.scala:58)
	scala.runtime.java8.JFunction0$mcV$sp.apply(JFunction0$mcV$sp.scala:18)
	scala.concurrent.Future$.$anonfun$apply$1(Future.scala:691)
	scala.concurrent.impl.Promise$Transformation.run(Promise.scala:500)
	java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1136)
	java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:635)
	java.base/java.lang.Thread.run(Thread.java:840)
```
#### Short summary: 

Java indexer failed with and exception.