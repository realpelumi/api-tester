"use client";

import { useState, useEffect } from "react";
import { RequestSection } from "@/components/sections/request";
import { ResponseSection } from "@/components/sections/response";
import { Header } from "@/components/header/header";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface HistoryItem {
  id: string;
  method: string;
  url: string;
  headers: { key: string; value: string }[];
  body: string;
  timestamp: number;
}

export default function Home() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    time: number;
    headers: Record<string, string>;
    data: unknown;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New State
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initialize theme and history
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem("api-tester-theme") as
      | "light"
      | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // History
    const savedHistory = localStorage.getItem("api-tester-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Update theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("api-tester-theme", theme);
  }, [theme]);

  // Save history
  useEffect(() => {
    localStorage.setItem("api-tester-history", JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleClear = () => {
    setMethod("GET");
    setUrl("");
    setHeaders([{ key: "", value: "" }]);
    setBody("");
    setResponse(null);
    setError(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setMethod(item.method);
    setUrl(item.url);
    setHeaders(item.headers);
    setBody(item.body);
    setIsHistoryOpen(false);
  };

  const handleSend = async () => {
    setError(null);
    setResponse(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("Invalid URL format");
      return;
    }

    if ((method === "POST" || method === "PUT" || method === "PATCH") && body) {
      try {
        JSON.parse(body);
      } catch {
        setError("Invalid JSON in request body");
        return;
      }
    }

    // Save to history
    const newHistoryItem: HistoryItem = {
      id: crypto.randomUUID(),
      method,
      url,
      headers,
      body,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50)); // Keep last 50

    setIsLoading(true);
    const startTime = performance.now();

    try {
      const requestHeaders: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim()) {
          requestHeaders[h.key] = h.value;
        }
      });

      const fetchOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...requestHeaders,
        },
      };

      if (
        (method === "POST" || method === "PUT" || method === "PATCH") &&
        body
      ) {
        fetchOptions.body = body;
      }

      const res = await fetch(url, fetchOptions);
      const endTime = performance.now();

      let data = null;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        time: Math.round(endTime - startTime),
        headers: responseHeaders,
        data,
      });
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to send request";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleHistory={() => setIsHistoryOpen(true)}
      />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <RequestSection
            method={method}
            url={url}
            headers={headers}
            body={body}
            isLoading={isLoading}
            onMethodChange={setMethod}
            onUrlChange={setUrl}
            onHeadersChange={setHeaders}
            onBodyChange={setBody}
            onSend={handleSend}
            onClear={handleClear}
          />
          <ResponseSection
            response={response}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </div>

      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent>
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Request History</SheetTitle>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
            <SheetDescription>
              Your recent requests will appear here.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No history yet
              </p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleRestoreHistory(item)}
                  className="p-3 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors space-y-2"
                >
                  <div className="flex items-center gap-2 font-medium">
                    <span
                      className={`text-xs px-2 py-0.5 rounded uppercase ${
                        item.method === "GET"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : item.method === "POST"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : item.method === "DELETE"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      }`}
                    >
                      {item.method}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p
                    className="text-sm truncate text-foreground font-mono"
                    title={item.url}
                  >
                    {item.url}
                  </p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
