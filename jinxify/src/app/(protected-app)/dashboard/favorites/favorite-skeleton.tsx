'use client'

import {Skeleton} from '@/components/ui/skeleton'

export function FavoriteLoadingSkeleton() {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="h-16 bg-primary/10 mb-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <ul className="space-y-4 w-full max-w-md">
            {[...Array(5)].map((_, index) => (
              <li key={'skeleton-$ {index}'}>
                <Skeleton className="h-16 w-full rounded-md" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  


