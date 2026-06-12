"use client";

import MiniSearch, { type SearchResult } from "minisearch";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { SearchIcon } from "@/components/icons";

interface StoredFields {
  title: string;
  description: string;
  url: string;
  section: string;
}

type Hit = SearchResult & StoredFields;

const MAX_RESULTS = 8;

// Module-level cache so the index is fetched and built only once per session,
// regardless of how many times the component mounts.
let indexPromise: Promise<MiniSearch> | null = null;

function loadIndex(): Promise<MiniSearch> {
  if (!indexPromise) {
    indexPromise = fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }
        return response.json();
      })
      .then((documents) => {
        const mini = new MiniSearch<StoredFields>({
          fields: ["title", "headings", "description", "text"],
          storeFields: ["title", "description", "url", "section"],
          searchOptions: {
            boost: { title: 4, headings: 2, description: 1.5 },
            prefix: true,
            fuzzy: 0.2
          }
        });
        mini.addAll(documents);
        return mini;
      })
      .catch((error) => {
        // Reset so a later attempt can retry after a transient failure.
        indexPromise = null;
        throw error;
      });
  }
  return indexPromise;
}

export function SearchBox() {
  const router = useRouter();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [index, setIndex] = useState<MiniSearch | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const ensureIndex = useCallback(() => {
    if (index) {
      return;
    }
    loadIndex()
      .then(setIndex)
      .catch(() => {
        /* search stays unavailable; the box still renders */
      });
  }, [index]);

  // Global Cmd/Ctrl+K shortcut to focus the search field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        ensureIndex();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ensureIndex]);

  // Close the results panel when clicking outside the component.
  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Re-run the query whenever the text or the loaded index changes.
  useEffect(() => {
    const trimmed = query.trim();
    if (!index || trimmed.length === 0) {
      setResults([]);
      setActive(0);
      return;
    }
    const hits = index.search(trimmed).slice(0, MAX_RESULTS) as Hit[];
    setResults(hits);
    setActive(0);
  }, [query, index]);

  const go = useCallback(
    (hit: Hit | undefined) => {
      if (!hit) {
        return;
      }
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
      router.push(hit.url);
    },
    [router]
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    } else if (event.key === "Escape") {
      if (query) {
        setQuery("");
      } else {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <div className="search" ref={containerRef}>
      <div className="search-field">
        <SearchIcon size={15} />
        <input
          aria-activedescendant={showPanel && results[active] ? `${listboxId}-${active}` : undefined}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={showPanel}
          aria-label="Search the documentation"
          autoComplete="off"
          className="search-input"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            ensureIndex();
            if (query) {
              setOpen(true);
            }
          }}
          onKeyDown={onKeyDown}
          placeholder="Search docs…"
          ref={inputRef}
          role="combobox"
          spellCheck={false}
          type="text"
          value={query}
        />
        <kbd className="search-kbd" aria-hidden="true">
          ⌘K
        </kbd>
      </div>

      {showPanel && (
        <div className="search-panel" id={listboxId} role="listbox">
          {results.length === 0 ? (
            <div className="search-empty">No results for “{query.trim()}”</div>
          ) : (
            results.map((hit, position) => (
              <button
                className={`search-result${position === active ? " is-active" : ""}`}
                id={`${listboxId}-${position}`}
                key={hit.id}
                onClick={() => go(hit)}
                onMouseEnter={() => setActive(position)}
                role="option"
                aria-selected={position === active}
                type="button"
              >
                <span className="search-result-title">{hit.title}</span>
                {hit.section && <span className="search-result-section">{hit.section}</span>}
                {hit.description && (
                  <span className="search-result-desc">{hit.description}</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
