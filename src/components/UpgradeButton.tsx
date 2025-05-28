
import React from "react";
import { Crown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface UpgradeButtonProps {
  onClick: () => void;
  isCollapsed?: boolean;
}

const UpgradeButton = ({ onClick, isCollapsed = false }: UpgradeButtonProps) => {
  const { isDark } = useTheme();

  const buttonClass = `
    relative overflow-hidden transition-all duration-200 ease-in-out cursor-pointer select-none
    min-w-0 border border-solid rounded-full font-normal text-center
    ${isCollapsed ? 'w-12 h-12 p-0' : 'w-full h-12 px-6 py-3'}
    ${isDark 
      ? `bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 border-gray-500 text-gray-200
         hover:from-gray-700 hover:via-gray-600 hover:to-gray-500 hover:border-gray-400
         active:from-gray-600 active:via-gray-500 active:to-gray-400 active:translate-y-0.5
         shadow-[0_1px_3px_rgba(0,0,0,0.4),0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]
         hover:shadow-[0_2px_4px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.25)]
         active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(0,0,0,0.2),0_1px_1px_rgba(255,255,255,0.1)]`
      : `bg-gradient-to-b from-gray-50 via-gray-200 to-gray-300 border-gray-400 text-gray-700
         hover:from-white hover:via-gray-100 hover:to-gray-200 hover:border-gray-300
         active:from-gray-200 active:via-gray-300 active:to-gray-400 active:translate-y-0.5
         shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.05)]
         hover:shadow-[0_2px_4px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-1px_0_rgba(0,0,0,0.07)]
         active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_1px_rgba(255,255,255,0.3)]`
    }
  `;

  const highlightClass = `
    absolute top-0.5 left-0.5 right-0.5 h-[45%] pointer-events-none
    ${isCollapsed ? 'rounded-full' : 'rounded-full'}
    ${isDark
      ? 'bg-gradient-to-b from-white/10 to-white/5'
      : 'bg-gradient-to-b from-white/40 to-white/10'
    }
  `;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      title={isCollapsed ? "Upgrade" : undefined}
    >
      <div className={highlightClass} />
      <div className={`relative z-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-center gap-2'}`}>
        <Crown className={`shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-5 w-5'}`} />
        {!isCollapsed && (
          <span className="font-semibold">Upgrade</span>
        )}
      </div>
    </button>
  );
};

export default UpgradeButton;
