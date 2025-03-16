import React from 'react';
import { Languages } from 'lucide-react';

function LanguageSelector() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <select className="bg-transparent border-none focus:outline-none text-sm">
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="mr">Marathi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh">Chinese</option>
      </select>
    </div>
  );
}

export default LanguageSelector;