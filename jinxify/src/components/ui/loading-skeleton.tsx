'use client'

import React from 'react';

export default function Loading() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <div className="w-64 bg-gray-200 animate-pulse"></div>
      <main className="flex-1 ml-4 mr-4 mt-4 mb-4 p-4 bg-white shadow-xl rounded-lg border border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
        <div className="space-y-8">
          {[...Array(2)].map((_, index) => (
            <div key={index}>
              <div className="h-6 bg-gray-200 rounded w-1/6 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}