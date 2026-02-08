"use client";

import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";

interface ResponseSectionProps {
  response: {
    status: number;
    time: number;
    headers: Record<string, string>;
    data: unknown;
  } | null;
  error: string | null;
  isLoading: boolean;
}

function getStatusBadgeColor(status: number) {
  if (status >= 200 && status < 300) return "bg-green-500";
  if (status >= 400 && status < 500) return "bg-yellow-500";
  if (status >= 500) return "bg-red-500";
  return "bg-muted";
}

export function ResponseSection({
  response,
  error,
  isLoading,
}: ResponseSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (response) {
      const text = JSON.stringify(response.data, null, 2);
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (response) {
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Response</h2>
        {response && (
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="mb-2 animate-spin text-2xl">⚙️</div>
            <p>Sending request...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-lg border border-red-500 bg-red-500/10 p-4">
          <p className="text-sm font-medium text-red-500">Error</p>
          <p className="mt-1 text-sm text-red-400">{error}</p>
        </div>
      )}

      {response && !error && !isLoading && (
        <div className="space-y-4">
          {/* Status and Time */}
          <div className="flex items-center gap-3">
            <div
              className={`${getStatusBadgeColor(response.status)} rounded-full px-3 py-1 text-sm font-semibold text-white`}
            >
              {response.status}
            </div>
            <span className="text-sm text-muted-foreground">
              {response.time}ms
            </span>
          </div>

          {/* Response Headers */}
          {Object.keys(response.headers).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Headers</h3>
              <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-input p-3">
                <div className="space-y-1 font-mono text-xs">
                  {Object.entries(response.headers).map(([key, value]) => (
                    <div key={key} className="text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {key}:
                      </span>{" "}
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Response Body */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Body</h3>
            <div className="max-h-96 overflow-y-auto rounded-md border border-border bg-input p-3">
              <pre className="font-mono text-xs text-muted-foreground">
                {typeof response.data === "string"
                  ? response.data
                  : JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {!response && !error && !isLoading && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-center text-muted-foreground">
            Response will appear here...
          </p>
        </div>
      )}
    </div>
  );
}
