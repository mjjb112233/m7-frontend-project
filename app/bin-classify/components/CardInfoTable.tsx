import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { CardInfo } from "../types"

interface CardInfoTableProps {
  cards: CardInfo[]
  onCopyCards: () => void
  onDownloadCards: () => void
}

export function CardInfoTable({ cards, onCopyCards, onDownloadCards }: CardInfoTableProps) {
  if (cards.length === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>卡片信息表格</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCopyCards}>
              <Copy className="h-4 w-4 mr-1" />
              复制
            </Button>
            <Button variant="outline" size="sm" onClick={onDownloadCards}>
              <Download className="h-4 w-4 mr-1" />
              下载
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>卡号</TableHead>
                <TableHead>品牌</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>等级</TableHead>
                <TableHead>银行</TableHead>
                <TableHead>国家</TableHead>
                <TableHead>货币</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cards.map((card, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-sm">
                    {card.cardNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{card.brand}</Badge>
                  </TableCell>
                  <TableCell>{card.type}</TableCell>
                  <TableCell>{card.level}</TableCell>
                  <TableCell>{card.bank}</TableCell>
                  <TableCell>{card.country}</TableCell>
                  <TableCell>{card.currency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
