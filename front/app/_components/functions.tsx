"use client";

import { fetchWithAuth } from "./fetchWithAuth";

type FetchFormOptions = {
  url: string;
  dateFields?: string[];
};

export async function fetchAndParseFormData({
  url,
  dateFields = [],
}: FetchFormOptions) {
  const response = await fetchWithAuth(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response) return;
  const data = await response.json();

  return parseDateFields(data, dateFields);
}

function parseDateFields(
  data: Record<string, any>,
  dateFields: string[]
): Record<string, any> {
  const parsed = { ...data };

  dateFields.forEach((field) => {
    if (Array.isArray(parsed[field])) {
      parsed[field] = parsed[field].map((item: any) => {
        if (item && !isNaN(Date.parse(item))) {
          return new Date(item);
        }
        return item;
      });
    } else {
      const value = parsed[field];
      if (value && !isNaN(Date.parse(value))) {
        parsed[field] = new Date(value);
      }
    }
  });
  return parsed;
}
