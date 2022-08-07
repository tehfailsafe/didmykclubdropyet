import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { createClient, Provider } from "urql";

import styles from "./tailwind.css";

const client = createClient({
    url: "https://jltalrmvohjgwsnyvvkp.supabase.co/graphql/v1",
    fetchOptions: {
        headers: {
            apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsdGFscm12b2hqZ3dzbnl2dmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTg4OTI0MzYsImV4cCI6MTk3NDQ2ODQzNn0.90fooS4JlBnNs3LEo2ywG-PP1T9-YMCaZ4JhPom3Cw8",
        },
    },
});

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "DidMykClubDropYet?",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="bg-gray-100">
                <Provider value={client}>
                    <Outlet />
                    <ScrollRestoration />
                    <Scripts />
                    <LiveReload />
                </Provider>
            </body>
        </html>
    );
}
