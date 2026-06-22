import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export function Table({ headers, children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-surface-50 dark:bg-gray-800/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider
                  ${i === 0 ? 'text-left rounded-tl-xl' : 'text-right'}
                  ${i === headers.length - 1 ? 'rounded-tr-xl' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
