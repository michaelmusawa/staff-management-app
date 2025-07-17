"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Search = ({ placeholder }: { placeholder: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [inputValue, setInputValue] = useState("");

  // Sync input with URL query param
  useEffect(() => {
    const query = searchParams.get("query")?.toString() || "";
    setInputValue(query);
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const clearSearch = () => {
    setInputValue("");
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          className="pl-10 pr-10 h-11 bg-background transition-all shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/50"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleSearch(e.target.value);
          }}
          aria-label="Search"
        />

        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FiX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Search;
