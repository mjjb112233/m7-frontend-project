"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300/50 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="text-blue-700 font-medium">{language === "zh" ? "中文" : "English"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px] shadow-lg border-blue-200/50">
        <DropdownMenuItem
          onClick={() => setLanguage("zh")}
          className={`transition-colors duration-200 ${
            language === "zh" ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" : "hover:bg-blue-50"
          }`}
        >
          {t("language.chinese")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={`transition-colors duration-200 ${
            language === "en" ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" : "hover:bg-blue-50"
          }`}
        >
          {t("language.english")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
