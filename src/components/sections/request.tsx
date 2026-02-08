"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { X } from "lucide-react";

interface Header {
  key: string;
  value: string;
}

interface RequestSectionProps {
  method: string;
  url: string;
  headers: Header[];
  body: string;
  isLoading: boolean;
  onMethodChange: (method: string) => void;
  onUrlChange: (url: string) => void;
  onHeadersChange: (headers: Header[]) => void;
  onBodyChange: (body: string) => void;
  onSend: () => void;
  onClear: () => void;
}

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];

export function RequestSection({
  method,
  url,
  headers,
  body,
  isLoading,
  onMethodChange,
  onUrlChange,
  onHeadersChange,
  onBodyChange,
  onSend,
  onClear,
}: RequestSectionProps) {
  const handleAddHeader = () => {
    onHeadersChange([...headers, { key: "", value: "" }]);
  };

  const handleRemoveHeader = (index: number) => {
    onHeadersChange(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    onHeadersChange(newHeaders);
  };

  const showBody = method === "POST" || method === "PUT" || method === "PATCH";

  return (
    <div className="space-y-6">
      {/* Method and URL */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Request</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear
          </Button>
        </div>

        {/* Method Dropdown */}
        <div className="flex gap-3">
          <select
            value={method}
            onChange={(e) => onMethodChange(e.target.value)}
            disabled={isLoading}
            className="rounded-md border border-border bg-input px-3 py-2 text-sm font-medium text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* URL Input */}
          <Input
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={isLoading}
            placeholder="https://jsonplaceholder.typicode.com/posts"
            className="flex-1"
          />
        </div>
      </div>

      {/* Headers Section */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Headers</h3>
          <Button
            onClick={handleAddHeader}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Add Header
          </Button>
        </div>

        <div className="space-y-3">
          {headers.map((header, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={header.key}
                onChange={(e) =>
                  handleHeaderChange(index, "key", e.target.value)
                }
                disabled={isLoading}
                placeholder="Header key"
              />
              <Input
                value={header.value}
                onChange={(e) =>
                  handleHeaderChange(index, "value", e.target.value)
                }
                disabled={isLoading}
                placeholder="Header value"
              />
              <button
                onClick={() => handleRemoveHeader(index)}
                disabled={isLoading}
                className="rounded-md border border-border bg-input p-2 text-muted-foreground hover:bg-secondary disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Body Section */}
      {showBody && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Body (JSON)</h3>
          <textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            disabled={isLoading}
            placeholder='{"key": "value"}'
            className="h-32 w-full rounded-md border border-border bg-input px-3 py-2 font-mono text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
          />
        </div>
      )}

      {/* Send Button */}
      <Button
        onClick={onSend}
        disabled={isLoading}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Sending request...
          </div>
        ) : (
          "Send Request"
        )}
      </Button>
    </div>
  );
}
4;
