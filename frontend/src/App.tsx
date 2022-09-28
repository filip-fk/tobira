import React, { ReactNode } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@emotion/cache";

import { environment } from "./relay";
import { GlobalStyle } from "./GlobalStyle";
import { ActiveRoute, Router } from "./router";
import { MatchedRoute } from "./rauta";
import { MenuProvider } from "./layout/MenuState";
import { GraphQLErrorBoundary } from "./relay/boundary";
import { LoadingIndicator } from "./ui/LoadingIndicator";


type Props = {
    initialRoute: MatchedRoute;
};

export const App: React.FC<Props> = ({ initialRoute }) => (
    <SilenceEmotionWarnings>
        <GlobalErrorBoundary>
            <RelayEnvironmentProvider {...{ environment }}>
                <GlobalStyle />
                <Router initialRoute={initialRoute}>
                    <GraphQLErrorBoundary>
                        <MenuProvider>
                            <LoadingIndicator />
                            <ActiveRoute />
                        </MenuProvider>
                    </GraphQLErrorBoundary>
                </Router>
            </RelayEnvironmentProvider>
        </GlobalErrorBoundary>
    </SilenceEmotionWarnings>
);

/**
 * This thingy is kind of sad. In short: emotion-js emits warnings whenever one
 * uses `:first-child` selectors in CSS. That's because stuff can break when
 * doing server side rendering and using those selectors, since emotion will
 * insert `<style>` tags. This is the best way to disable the warning globally.
 * We don't need that warning because we won't do SSR.
 *
 * Full story: https://github.com/emotion-js/emotion/issues/1105
 */
const SilenceEmotionWarnings: React.FC<{ children: ReactNode }> = ({ children }) => {
    const cache = createEmotionCache({
        key: "css",
        nonce: document.documentElement.dataset.tobiraStyleNonce,
        ...(process.env.NODE_ENV === "development" && { stylisPlugins: [] }),
    });
    cache.compat = true;

    return <CacheProvider value={cache}>{children}</CacheProvider>;
};

type GlobalErrorBoundaryState = {
    error?: unknown;
};

type GlobalErrorBoundaryProps = {
    children: ReactNode;
};

class GlobalErrorBoundary
    extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
    public constructor(props: GlobalErrorBoundaryProps) {
        super(props);
        this.state = { error: undefined };
    }

    public static getDerivedStateFromError(error: unknown): GlobalErrorBoundaryState {
        return { error };
    }

    public render(): ReactNode {
        const error = this.state.error;
        if (!error) {
            return this.props.children;
        }

        // We are using English here instead of translated strings in order to
        // have fewer possibilities this component will error itself. If this
        // last error catcher errors, that would be bad. And since users should
        // not see this anyway, I think it's fine. Even if users don't
        // understand English at all, "error" is usually understood and the
        // design should convey most of the information anyway.
        return (
            <div css={{
                margin: "auto",
                paddingTop: "5vh",
                width: 400,
                maxWidth: "95%",
                fontFamily: "var(--main-font), sans-serif",
            }}>
                <div css={{
                    backgroundColor: "var(--danger-color, #b64235)",
                    color: "var(--danger-color-bw-contrast, white)",
                    borderRadius: 4,
                    padding: 16,
                }}>
                    <h1 css={{ marginTop: 0, fontSize: 28 }}>Critical Error</h1>
                    <p>
                        A critical error has occured!
                        The application cannot resume in this state.
                        Please try refreshing the page.
                        If that does not work, please contact your system administrator.
                        Sorry for the inconvenience!
                    </p>
                </div>
                <div css={{ marginTop: 32 }}>
                    <h2 css={{ fontSize: 22 }}>Information for developers</h2>
                    <pre>
                        <code css={{ whiteSpace: "pre-wrap" }}>
                            {String(error)}
                        </code>
                    </pre>
                </div>
            </div>
        );
    }
}
