import { Callout, Tag } from "@blueprintjs/core";
import style from "./JsonView.module.css";
import { Link } from "@tanstack/react-router";

interface JsonViewerProps {
    json: unknown;
}

interface BasePart {
    type: string;
    value: string;
}

interface StringPart extends BasePart {
    type: "string";
}

interface LinkPart extends BasePart {
    type: "link";

    href: string;
}

interface DateTimePart extends BasePart {
    type: "datetime";

    date: Date;
}

interface JsxPart extends BasePart {
    type: "jsx";

    jsx: React.ReactNode;
}

type Part = StringPart | LinkPart | DateTimePart | JsxPart;

export default function JsonViewer(props: JsonViewerProps) {
    const { json } = props;

    if (json === undefined) {
        return <div>undefined</div>;
    }

    let jsonText: string;
    try {
        jsonText = JSON.stringify(json, null, 2) ?? "";
    } catch (e) {
        return <div>Invalid JSON</div>;
    }

    const parts = parseParts(jsonText);

    return (
        <Callout className="text-xs flex">
            <div className="overflow-auto">
                <pre className="overflow-auto">{renderParts(parts)}</pre>
            </div>
        </Callout>
    );
}

function replaceMatchesWithParts(
    parts: Part[],
    re: RegExp,
    onMatch: (text: string) => Part[],
): Part[] {
    const results: Part[] = [];
    for (const part of parts) {
        if (part.type !== "string") {
            results.push(part);
            continue;
        }

        if (!part.value) {
            continue;
        }
        const matches = part.value.split(re);

        if (!matches) {
            results.push(part);
            continue;
        }

        for (const match of matches) {
            if (re.test(match)) {
                results.push(...onMatch(match));
                continue;
            }

            results.push({
                type: "string",
                value: match,
            });
        }
    }

    return results;
}

const DID_REGEX = /(did:plc:[a-zA-Z0-9]+)/i;
const URL_REGEX = /(https?:\/\/[^\s/$.?#].[^\s]*)/i;
const DATE_TIME_REGEX = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/;

function parseParts(text: string) {
    let parts: Part[] = [
        {
            type: "string",
            value: text,
        },
    ];

    parts = replaceMatchesWithParts(parts, URL_REGEX, t => [{ type: "link", href: t, value: t }]);
    parts = replaceMatchesWithParts(parts, DATE_TIME_REGEX, t => [
        { type: "datetime", date: new Date(t), value: t },
    ]);

    parts = replaceMatchesWithParts(parts, DID_REGEX, t => [
        {
            type: "jsx",
            jsx: (
                <Link
                    to="/profile/$did"
                    params={{
                        did: t,
                    }}
                >
                    {t}
                </Link>
            ),
            value: t,
        },
    ]);

    return parts;
}

function renderParts(parts: Part[]) {
    return parts.map((part, index) => {
        switch (part.type) {
            case "datetime":
                return (
                    <Tag icon="calendar" minimal key={index}>
                        {part.date.toLocaleString()}
                    </Tag>
                );

            case "link":
                return (
                    <a key={index} href={part.href}>
                        {part.value}
                    </a>
                );

            case "jsx":
                return part.jsx;

            case "string":
            default:
                return <span key={index}>{part.value}</span>;
        }
    });
}
