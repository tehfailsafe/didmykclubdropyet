import type { LinksFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import * as gtag from "~/utils/gtags.client";

import styles from "./tailwind.css";
import { useEffect } from "react";

type LoaderData = {
    gaTrackingId: string | undefined;
};

export const loader: LoaderFunction = async () => {
    return json<LoaderData>({ gaTrackingId: process.env.GA_TRACKING_ID });
};

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Did My Kraken Club Drop Yet?",
    viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
    return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
    const { gaTrackingId } = useLoaderData<LoaderData>();
    useEffect(() => {
        if (gaTrackingId?.length) {
            gtag.pageview(location.pathname, gaTrackingId);
        }
    }, [gaTrackingId]);

    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body className="bg-gray-100">
                {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
                    <>
                        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
                        <script
                            async
                            id="gtag-init"
                            dangerouslySetInnerHTML={{
                                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
                            }}
                        />
                    </>
                )}

                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}
