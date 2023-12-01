import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";

import "@radix-ui/themes/styles.css";

import { Theme as RadixTheme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { THEME_STORE } from "./models/theme";
import { observer } from "mobx-react";
import { GlobalStyle } from "./styles/global";

const queryClient = new QueryClient();

const Root = observer(() => {
    const theme = THEME_STORE.theme;

    return (
        <ThemeProvider theme={theme}>
            <RadixTheme>
                <GlobalStyle />
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                </QueryClientProvider>
            </RadixTheme>
        </ThemeProvider>
    );
});

// Render our app!
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<Root />);
}
