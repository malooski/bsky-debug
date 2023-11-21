import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// using node-style package resolution in a CSS file:
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "normalize.css/normalize.css";

import "./styles/output.css";
import "./styles/global.css";

import { router } from "./router";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

// Render our app!
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>,
    );
}
