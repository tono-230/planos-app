import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X, Building2 } from "lucide-react";

interface Store {
  store_code: number;
  store_name: string;
  league: string;
  store_manager: string;
  country: string;
  prefecture: string;
  am: string;
  sv: string;
  area: string;
  max_capacity: number;
}

const STORES: Store[] = [
  { store_code: 581, store_name: "イオンモール鹿児島", league: "J2", store_manager: "池田昌代", country: "Japan", prefecture: "鹿児島", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1912 },
  { store_code: 2122, store_name: "イオンモール木曽川", league: "J2", store_manager: "川添未知瑠", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 1872 },
  { store_code: 770, store_name: "ルクア大阪", league: "J1", store_manager: "平本有記", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 1744 },
  { store_code: 2112, store_name: "セブンパーク天美", league: "J3", store_manager: "ギリ ニサナ", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 1728 },
  { store_code: 647, store_name: "イオンモール倉敷", league: "J1", store_manager: "北森章子", country: "Japan", prefecture: "岡山", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1680 },
  { store_code: 767, store_name: "イオンモール常滑", league: "J2", store_manager: "浅岡智代", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 1680 },
  { store_code: 796, store_name: "則武新町", league: "J3", store_manager: "沖麻衣子", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1680 },
  { store_code: 554, store_name: "イオンモール新発田", league: "J3", store_manager: "坂井司", country: "Japan", prefecture: "新潟", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1632 },
  { store_code: 773, store_name: "SUNAMO", league: "J3", store_manager: "小野内勇", country: "Japan", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 1616 },
  { store_code: 2133, store_name: "イオンモール八幡東", league: "J2", store_manager: "片山一樹", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1616 },
  { store_code: 592, store_name: "川崎ダイス", league: "J1", store_manager: "赤間久美子", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 1584 },
  { store_code: 541, store_name: "ブルメール舞多聞", league: "J2", store_manager: "松岡優丞", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 1580 },
  { store_code: 781, store_name: "イオンモール大牟田", league: "J3", store_manager: "江口和奏", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "田口裕一朗", area: "九州A", max_capacity: 1520 },
  { store_code: 676, store_name: "ららぽーと立川立飛", league: "J2", store_manager: "井ノ上柊", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1507 },
  { store_code: 2126, store_name: "イオンマリンピア", league: "J3", store_manager: "掬川典央", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 1500 },
  { store_code: 779, store_name: "アミュプラザくまもと", league: "J3", store_manager: "高倉萌子", country: "Japan", prefecture: "熊本", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 1488 },
  { store_code: 641, store_name: "なんばウォーク2番街", league: "J1", store_manager: "周偉健", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 1464 },
  { store_code: 778, store_name: "ララガーデン川口", league: "J4", store_manager: "仁位美咲", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 1460 },
  { store_code: 486, store_name: "イオンモール姫路リバーシティー", league: "J2", store_manager: "村山拓海", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 1456 },
  { store_code: 752, store_name: "イーアス沖縄豊崎", league: "J3", store_manager: "神谷美奈", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1387 },
  { store_code: 2115, store_name: "イオンモール各務原", league: "J4", store_manager: "高橋英司", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1376 },
  { store_code: 2138, store_name: "イオンモール土岐", league: "J3", store_manager: "髙木茉保", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1376 },
  { store_code: 798, store_name: "石垣島", league: "J3", store_manager: "宮下聖", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 1352 },
  { store_code: 610, store_name: "イオンモール広島祇園", league: "J2", store_manager: "上田徹", country: "Japan", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1350 },
  { store_code: 2127, store_name: "大宮マルイ", league: "J3", store_manager: "淡島紗里奈", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 1344 },
  { store_code: 2178, store_name: "イオンタウン四日市泊", league: "J4", store_manager: "仲口あかり", country: "Japan", prefecture: "三重", am: "平林真之", sv: "平林真之", area: "中部", max_capacity: 1336 },
  { store_code: 787, store_name: "イオンモール白山", league: "J2", store_manager: "岡島朋子", country: "Japan", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 1332 },
  { store_code: 746, store_name: "心斎橋", league: "J1", store_manager: "古川 亮太", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 1328 },
  { store_code: 780, store_name: "鹿児島中央Li-Ka1920", league: "J5", store_manager: "末廣直哉", country: "Japan", prefecture: "鹿児島", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1312 },
  { store_code: 794, store_name: "イオンモール大日", league: "J3", store_manager: "鮎川潤也", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1312 },
  { store_code: 512, store_name: "イオンモール宮崎", league: "J1", store_manager: "白土真由美", country: "Japan", prefecture: "宮崎", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1304 },
  { store_code: 573, store_name: "パークプレイス大分", league: "J2", store_manager: "中津透", country: "Japan", prefecture: "大分", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1296 },
  { store_code: 2174, store_name: "ららテラスHARUMI FLAG", league: "J5", store_manager: "與那城廣海", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 1288 },
  { store_code: 531, store_name: "イオンモール新利府北館", league: "J4", store_manager: "阿部微花", country: "Japan", prefecture: "宮城", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 1280 },
  { store_code: 745, store_name: "ららぽーと和泉", league: "J2", store_manager: "新田虹音", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1276 },
  { store_code: 2181, store_name: "アミュプラザ長崎", league: "J3", store_manager: "下条正隆", country: "Japan", prefecture: "長崎", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 1270 },
  { store_code: 754, store_name: "サンエー石川シティ", league: "J3", store_manager: "平良真亀", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 1264 },
  { store_code: 2111, store_name: "ららぽーと柏の葉", league: "J3", store_manager: "芳賀千裕", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1252 },
  { store_code: 2125, store_name: "エキソアレ西神中央", league: "J4", store_manager: "佐伯敏輝", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 1248 },
  { store_code: 727, store_name: "イオン南風原", league: "J2", store_manager: "國吉莉奈", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1246 },
  { store_code: 2116, store_name: "島忠ホームズ所沢", league: "J5", store_manager: "関琢翔", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1232 },
  { store_code: 2145, store_name: "モレラ岐阜", league: "J3", store_manager: "若山茜", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1232 },
  { store_code: 2161, store_name: "クラソ・プレイス香林坊店", league: "J5", store_manager: "佐藤紗江", country: "Japan", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 1232 },
  { store_code: 731, store_name: "ダイバーシティ東京プラザ", league: "J2", store_manager: "吉無田杏", country: "Japan", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 1224 },
  { store_code: 738, store_name: "イオンモール浜松志都呂", league: "J4", store_manager: "吉田達矢", country: "Japan", prefecture: "静岡", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 1224 },
  { store_code: 783, store_name: "イオンモール春日部", league: "J3", store_manager: "藤本 理子", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1216 },
  { store_code: 524, store_name: "イオンモール京都五条", league: "J2", store_manager: "細田真也", country: "Japan", prefecture: "京都", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1208 },
  { store_code: 2202, store_name: "イトーヨーカドー大森", league: "J3", store_manager: "エミチォ", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 1206 },
  { store_code: 756, store_name: "松坂屋高槻", league: "J3", store_manager: "高島和也", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1202 },
  { store_code: 744, store_name: "近鉄草津", league: "J4", store_manager: "藤川絹代", country: "Japan", prefecture: "滋賀", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1200 },
  { store_code: 2102, store_name: "酒々井プレミアム・アウトレット", league: "J2", store_manager: "小野和人", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1188 },
  { store_code: 61, store_name: "池袋西口", league: "J1", store_manager: "長嶺綾乃", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1184 },
  { store_code: 558, store_name: "ノースポート・モール", league: "J3", store_manager: "佐藤はるか", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 1184 },
  { store_code: 561, store_name: "アリオ加古川", league: "J2", store_manager: "増田梨央", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 1180 },
  { store_code: 748, store_name: "イオン新浦安", league: "J2", store_manager: "大越美久", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 1180 },
  { store_code: 2196, store_name: "イオンモール福津", league: "J3", store_manager: "松野陽音", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1176 },
  { store_code: 785, store_name: "赤羽ビビオ", league: "J2", store_manager: "久保田英治", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 1170 },
  { store_code: 575, store_name: "アミュエスト博多", league: "J1", store_manager: "我喜屋夢可", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 1169 },
  { store_code: 726, store_name: "サンエーパルコシティ", league: "J2", store_manager: "山内望聖", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1160 },
  { store_code: 2150, store_name: "イオンなかま", league: "J4", store_manager: "平松亮", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1160 },
  { store_code: 2176, store_name: "イオンモール三光", league: "J4", store_manager: "堂下博和", country: "Japan", prefecture: "大分", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1160 },
  { store_code: 2183, store_name: "エミテラス所沢", league: "J2", store_manager: "鈴木祥郎", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1160 },
  { store_code: 720, store_name: "ODAKYU湘南GATE", league: "J4", store_manager: "大浦 賢介", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 1156 },
  { store_code: 2166, store_name: "フレスポ鳥栖", league: "J4", store_manager: "姪原哲也", country: "Japan", prefecture: "佐賀", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 1146 },
  { store_code: 791, store_name: "イオンモール千葉ニュータウン", league: "J4", store_manager: "井口繁未梨", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1136 },
  { store_code: 2217, store_name: "マークイズ福岡ももち", league: "J3", store_manager: "池田華", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 1136 },
  { store_code: 683, store_name: "マーサ21", league: "J3", store_manager: "嶋井拓夢", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1132 },
  { store_code: 747, store_name: "ララガーデン長町", league: "J5", store_manager: "我妻安奈", country: "Japan", prefecture: "宮城", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 1128 },
  { store_code: 713, store_name: "イオンモール広島府中", league: "J2", store_manager: "山本一貴", country: "Japan", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1120 },
  { store_code: 762, store_name: "くみまちモールあさか", league: "J2", store_manager: "増澤紅美", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1120 },
  { store_code: 523, store_name: "イオンモール香椎浜", league: "J1", store_manager: "東雄太", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 1116 },
  { store_code: 667, store_name: "イオンモール多摩平の森", league: "J2", store_manager: "瀬能英典", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1116 },
  { store_code: 685, store_name: "イオンモール新小松", league: "J2", store_manager: "小坂隆哉", country: "Japan", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 1104 },
  { store_code: 793, store_name: "立川高島屋S.C.", league: "J4", store_manager: "児玉祐樹", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1104 },
  { store_code: 739, store_name: "吉祥寺", league: "J2", store_manager: "今井彩乃", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1096 },
  { store_code: 761, store_name: "三井アウトレットパーク北陸小矢部", league: "J5", store_manager: "荒谷野乃香", country: "Japan", prefecture: "富山", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 1096 },
  { store_code: 2142, store_name: "イオンモール茨木", league: "J3", store_manager: "益田大雅", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1096 },
  { store_code: 774, store_name: "イオンモール木更津", league: "J2", store_manager: "米山純", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 1092 },
  { store_code: 669, store_name: "イオンモール沖縄ライカム", league: "J2", store_manager: "大浜なみ", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 1088 },
  { store_code: 766, store_name: "ゆめタウン宇部", league: "J5", store_manager: "上野真稔", country: "Japan", prefecture: "山口", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1087 },
  { store_code: 668, store_name: "ららぽーと富士見", league: "J2", store_manager: "長谷川由享", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 1080 },
  { store_code: 688, store_name: "阪急三番街", league: "J2", store_manager: "黄玉婷", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 1080 },
  { store_code: 760, store_name: "さんすて岡山", league: "J4", store_manager: "小林直子", country: "Japan", prefecture: "岡山", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1080 },
  { store_code: 736, store_name: "イオンモール柏", league: "J4", store_manager: "貞永京馬", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1076 },
  { store_code: 2169, store_name: "ミーツ国分寺", league: "J4", store_manager: "カンユビン", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1072 },
  { store_code: 2184, store_name: "浜松メイワン", league: "J5", store_manager: "上代優花", country: "Japan", prefecture: "静岡", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 1070 },
  { store_code: 724, store_name: "サンエー西原シティ", league: "J3", store_manager: "新垣沙南無カーン", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1067 },
  { store_code: 698, store_name: "イオンモール座間", league: "J2", store_manager: "和田博章", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 1064 },
  { store_code: 708, store_name: "イオンタウンユーカリが丘", league: "J3", store_manager: "村松優花", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1064 },
  { store_code: 624, store_name: "イオン北谷", league: "J4", store_manager: "亀島海夕", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 1060 },
  { store_code: 2105, store_name: "カインズ前橋吉岡", league: "J5", store_manager: "瀬谷隼人", country: "Japan", prefecture: "群馬", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 1056 },
  { store_code: 673, store_name: "イオンモール四條畷", league: "J1", store_manager: "登尾幸恵", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1052 },
  { store_code: 2227, store_name: "サンエー経塚シティ", league: "", store_manager: "洲鎌結実花", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1052 },
  { store_code: 692, store_name: "イオン那覇", league: "J2", store_manager: "池村祐璃", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1048 },
  { store_code: 776, store_name: "東京ドームシティ ラクーア", league: "J3", store_manager: "二階堂瑠璃", country: "Japan", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 1048 },
  { store_code: 654, store_name: "新宿マルイアネックス", league: "J2", store_manager: "リンシン", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 1045 },
  { store_code: 751, store_name: "セレオ甲府", league: "J4", store_manager: "河野司", country: "Japan", prefecture: "山梨", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1044 },
  { store_code: 2128, store_name: "ららぽーと福岡", league: "J2", store_manager: "江本菜摘", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "田口裕一朗", area: "九州A", max_capacity: 1044 },
  { store_code: 526, store_name: "イオンモール北戸田", league: "J2", store_manager: "長沢秀和", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 1040 },
  { store_code: 680, store_name: "サニーサイドモール小倉", league: "J4", store_manager: "菊地奈美", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1040 },
  { store_code: 2206, store_name: "サンエー宜野湾コンベンションシティ", league: "J3", store_manager: "桃原奈々", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 1040 },
  { store_code: 2137, store_name: "セブンパークアリオ柏", league: "J4", store_manager: "石井勇翔", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 1036 },
  { store_code: 2171, store_name: "ピヴォ　クロス", league: "J5", store_manager: "大谷美咲", country: "Japan", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 1032 },
  { store_code: 769, store_name: "ゆめタウン出雲", league: "J4", store_manager: "立花孝一", country: "Japan", prefecture: "島根", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1028 },
  { store_code: 2118, store_name: "あみプレミアム・アウトレット", league: "J4", store_manager: "吉葉裕也", country: "Japan", prefecture: "茨城", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 1028 },
  { store_code: 640, store_name: "ベルモール宇都宮", league: "J2", store_manager: "藤丸拓也", country: "Japan", prefecture: "栃木", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 1024 },
  { store_code: 759, store_name: "京王高幡ショッピングセンター", league: "J5", store_manager: "遠藤昭悟", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 1020 },
  { store_code: 768, store_name: "イオンモールKYOTO", league: "J2", store_manager: "浅井義賢", country: "Japan", prefecture: "京都", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 1020 },
  { store_code: 757, store_name: "RAYARD Hisaya-odori Park", league: "J4", store_manager: "筒木誠二", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 1012 },
  { store_code: 2163, store_name: "ららぽーと湘南平塚", league: "J4", store_manager: "庄司 澄佳", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 1012 },
  { store_code: 717, store_name: "アミュプラザ小倉", league: "J3", store_manager: "松本美咲", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 1008 },
  { store_code: 2120, store_name: "名古屋ゲートウォーク", league: "J2", store_manager: "藤居祐実", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 1008 },
  { store_code: 2170, store_name: "JR折尾駅", league: "J5", store_manager: "池原夢乃", country: "Japan", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 1008 },
  { store_code: 670, store_name: "有楽町マルイ", league: "J2", store_manager: "紺野真央", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 1005 },
  { store_code: 2104, store_name: "ゆめタウンみゆき", league: "J5", store_manager: "山本一貴", country: "Japan", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 1004 },
  { store_code: 758, store_name: "サンエー那覇メインプレイス", league: "J2", store_manager: "大城莉子", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 1000 },
  { store_code: 2197, store_name: "イオンタウン日田", league: "J5", store_manager: "日髙大輝", country: "Japan", prefecture: "大分", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 996 },
  { store_code: 777, store_name: "ビーンズ戸田公園", league: "J5", store_manager: "稲村和宏", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 992 },
  { store_code: 631, store_name: "イオン具志川", league: "J3", store_manager: "島袋拓海", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 988 },
  { store_code: 790, store_name: "ゆめタウン武雄", league: "J5", store_manager: "日高大輝", country: "Japan", prefecture: "佐賀", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 976 },
  { store_code: 2156, store_name: "イオンモール豊川", league: "J3", store_manager: "木下友貴", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 976 },
  { store_code: 2134, store_name: "イオンモール筑紫野", league: "J3", store_manager: "鶴見桃子", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 970 },
  { store_code: 694, store_name: "イオンモール伊丹昆陽", league: "J2", store_manager: "小野賢一", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 968 },
  { store_code: 723, store_name: "レイリア大橋", league: "J3", store_manager: "野村里穂", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 968 },
  { store_code: 788, store_name: "LICOPA鶴見", league: "J4", store_manager: "佐野 遼太郎", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 962 },
  { store_code: 2119, store_name: "なんばCITY", league: "J2", store_manager: "阿賀 美帆", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 952 },
  { store_code: 2172, store_name: "イオンモール津田沼", league: "J4", store_manager: "富山大貴", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 948 },
  { store_code: 525, store_name: "イオンモール福岡", league: "J2", store_manager: "陶山翔平", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 944 },
  { store_code: 551, store_name: "イオンモール佐賀大和", league: "J4", store_manager: "田島晋平", country: "Japan", prefecture: "佐賀", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 940 },
  { store_code: 2185, store_name: "コロワ甲子園", league: "J4", store_manager: "阿部彩", country: "Japan", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 936 },
  { store_code: 2190, store_name: "飯田橋ラムラ", league: "J5", store_manager: "前川将大", country: "Japan", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 936 },
  { store_code: 2191, store_name: "BiVi新さっぽろ", league: "J5", store_manager: "三浦亜子", country: "Japan", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 936 },
  { store_code: 749, store_name: "コースカ　ベイサイドストアーズ", league: "J4", store_manager: "武藤ゆう", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 932 },
  { store_code: 737, store_name: "ららぽーと新三郷", league: "J4", store_manager: "小林健太", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 928 },
  { store_code: 2113, store_name: "ゆめタウン下松", league: "J4", store_manager: "柴川達博", country: "Japan", prefecture: "山口", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 928 },
  { store_code: 2164, store_name: "ららぽーと横浜", league: "J3", store_manager: "丸田浩貴", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 928 },
  { store_code: 2177, store_name: "イオンモール幕張新都心", league: "J4", store_manager: "遠藤猛史", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 928 },
  { store_code: 491, store_name: "枚方ビオルネ", league: "J4", store_manager: "永田永二郎", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 924 },
  { store_code: 553, store_name: "イオンタウン郡山", league: "J1", store_manager: "松山美智子", country: "Japan", prefecture: "福島", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 920 },
  { store_code: 650, store_name: "マックスバリュとよみ", league: "J3", store_manager: "幸地志帆", country: "Japan", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 920 },
  { store_code: 718, store_name: "マルイファミリー溝口", league: "J3", store_manager: "湊龍平", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 920 },
  { store_code: 753, store_name: "錦糸町丸井", league: "J3", store_manager: "山本翔太", country: "Japan", prefecture: "東京", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 920 },
  { store_code: 2129, store_name: "浦和コルソ", league: "J5", store_manager: "小林里帆", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 920 },
  { store_code: 2187, store_name: "イオンモール大垣", league: "J5", store_manager: "青山哲太", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 920 },
  { store_code: 750, store_name: "イオン松江", league: "J4", store_manager: "嘉本真我", country: "Japan", prefecture: "島根", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 912 },
  { store_code: 2117, store_name: "ソラリアステージ", league: "J2", store_manager: "下田一輝", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 912 },
  { store_code: 2140, store_name: "ラソラ札幌", league: "J4", store_manager: "大島真紀", country: "Japan", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 912 },
  { store_code: 795, store_name: "ウィング新橋", league: "J2", store_manager: "パクヒョヌ", country: "Japan", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 908 },
  { store_code: 2173, store_name: "ららテラスTOKYO-BAY", league: "J5", store_manager: "糸田雄一", country: "Japan", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 908 },
  { store_code: 622, store_name: "イオン延岡", league: "J3", store_manager: "堂下博和", country: "Japan", prefecture: "宮崎", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 906 },
  { store_code: 2139, store_name: "ふかや花園プレミアム・アウトレット", league: "J5", store_manager: "阿部直樹", country: "Japan", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 904 },
  { store_code: 743, store_name: "イオンモール津山", league: "J5", store_manager: "濱原彩花", country: "Japan", prefecture: "岡山", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 900 },
  { store_code: 2188, store_name: "たまプラーザテラス", league: "J3", store_manager: "水戸 大夢", country: "Japan", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 888 },
  { store_code: 583, store_name: "関マーゴ", league: "J3", store_manager: "嘉数力", country: "Japan", prefecture: "岐阜", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 880 },
  { store_code: 612, store_name: "仙台セルバ", league: "J4", store_manager: "伊藤無我", country: "Japan", prefecture: "宮城", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 880 },
  { store_code: 635, store_name: "イオンタウン千種", league: "J3", store_manager: "野村菜々子", country: "Japan", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 880 },
  { store_code: 684, store_name: "あべのハルカス", league: "J2", store_manager: "中島秀郎", country: "Japan", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 880 },
  { store_code: 2158, store_name: "TIME TIME ゆめタウン八女", league: "J5", store_manager: "神田健作", country: "Japan", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 880 },
  { store_code: 2159, store_name: "弘前ヒロロ", league: "J5", store_manager: "", country: "Japan", prefecture: "青森", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 880 },
  { store_code: 2182, store_name: "ゆめが丘ソラトス", league: "J3", store_manager: "矢倉諭", country: "", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 876 },
  { store_code: 532, store_name: "イオンタウンさくら", league: "J3", store_manager: "中野敦史", country: "", prefecture: "栃木", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 872 },
  { store_code: 722, store_name: "イオンモール東浦", league: "J2", store_manager: "村岡良介", country: "", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 872 },
  { store_code: 2200, store_name: "サカエチカ", league: "J4", store_manager: "大澤優衣", country: "", prefecture: "愛知", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 872 },
  { store_code: 646, store_name: "イオンタウン南城大里", league: "J5", store_manager: "久場申太郎", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 864 },
  { store_code: 665, store_name: "秋葉原ラジオ会館", league: "J1", store_manager: "仲宗根李菜", country: "", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 864 },
  { store_code: 2135, store_name: "イオンモール出雲", league: "J5", store_manager: "末村美月", country: "", prefecture: "島根", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 864 },
  { store_code: 2147, store_name: "ビナフロント海老名", league: "J4", store_manager: "宍倉瑠奈", country: "", prefecture: "神奈川", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 864 },
  { store_code: 2149, store_name: "静岡パルコ", league: "J5", store_manager: "", country: "", prefecture: "静岡", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 864 },
  { store_code: 2198, store_name: "イトーヨーカドー伊勢原", league: "J5", store_manager: "中田 穂奈美", country: "", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 864 },
  { store_code: 478, store_name: "イオン東海", league: "J4", store_manager: "沢畑由美子", country: "", prefecture: "茨城", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 848 },
  { store_code: 2160, store_name: "レイリア久留米", league: "J5", store_manager: "長崎結衣", country: "", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 848 },
  { store_code: 681, store_name: "マークイズみなとみらい", league: "J3", store_manager: "岩崎遼", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 844 },
  { store_code: 763, store_name: "青葉台東急スクエア", league: "J4", store_manager: "鈴木菜々子", country: "", prefecture: "神奈川", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 844 },
  { store_code: 2146, store_name: "イオンモール成田", league: "J3", store_manager: "鈴木彩華", country: "", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 844 },
  { store_code: 467, store_name: "イオン仙台幸町", league: "J5", store_manager: "生駒梨乃", country: "", prefecture: "宮城", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 840 },
  { store_code: 678, store_name: "コクーンシティ", league: "J3", store_manager: "伊藤和之", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 836 },
  { store_code: 699, store_name: "イオン豊橋南", league: "J2", store_manager: "三森優菜", country: "", prefecture: "愛知", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 836 },
  { store_code: 580, store_name: "ゆめタウン呉", league: "J3", store_manager: "西田卓", country: "", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 832 },
  { store_code: 730, store_name: "具志川メインシティ", league: "J3", store_manager: "照屋椎菜", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 830 },
  { store_code: 2223, store_name: "まるひろ上尾SC", league: "J4", store_manager: "海老名真尋", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 825 },
  { store_code: 2180, store_name: "自由が丘デュアオーネ", league: "J4", store_manager: "棚町優花", country: "", prefecture: "東京", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 822 },
  { store_code: 590, store_name: "イオンタウン津城山", league: "J4", store_manager: "松山裕幸", country: "", prefecture: "三重", am: "平林真之", sv: "平林真之", area: "中部", max_capacity: 820 },
  { store_code: 666, store_name: "イオンタウン黒崎", league: "J4", store_manager: "", country: "", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 818 },
  { store_code: 732, store_name: "アリオ八尾", league: "J3", store_manager: "佐藤麻耶", country: "", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 816 },
  { store_code: 2186, store_name: "イオンタウン姶良", league: "J4", store_manager: "新留研二", country: "", prefecture: "鹿児島", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 816 },
  { store_code: 550, store_name: "イオンタウン天理", league: "J5", store_manager: "寺尾和己", country: "", prefecture: "奈良", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 812 },
  { store_code: 611, store_name: "イオンタウン江別", league: "J4", store_manager: "藤井亘", country: "", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 812 },
  { store_code: 786, store_name: "渋谷地下街", league: "J3", store_manager: "植松優香", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 812 },
  { store_code: 2167, store_name: "近鉄橿原", league: "J5", store_manager: "山上千晴", country: "", prefecture: "奈良", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 808 },
  { store_code: 2193, store_name: "イオンスタイル碑文谷", league: "J5", store_manager: "林雄太", country: "", prefecture: "東京", am: "谷口里美", sv: "王攀", area: "関東A", max_capacity: 808 },
  { store_code: 582, store_name: "ゆめタウンはません", league: "J3", store_manager: "河原朋昌", country: "", prefecture: "熊本", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 807 },
  { store_code: 544, store_name: "イオン穂波", league: "J3", store_manager: "松村由紀", country: "", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 800 },
  { store_code: 740, store_name: "ユニモちはら台", league: "J3", store_manager: "狩俣のどか", country: "", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 800 },
  { store_code: 2131, store_name: "りんくうプレミアム・アウトレット", league: "J2", store_manager: "榊 みのり", country: "", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 800 },
  { store_code: 2144, store_name: "SOMES屋久島", league: "J5", store_manager: "加藤尚樹", country: "", prefecture: "鹿児島", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 800 },
  { store_code: 2194, store_name: "エキア志木", league: "J5", store_manager: "新井冬威", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 800 },
  { store_code: 2179, store_name: "TIME TIME ゆめタウン別府", league: "J5", store_manager: "麻生龍二", country: "", prefecture: "大分", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 792 },
  { store_code: 2121, store_name: "サンエー宮古島シティ", league: "J4", store_manager: "安里太介", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 784 },
  { store_code: 2165, store_name: "JR佐賀駅", league: "J5", store_manager: "頼本 侑磨", country: "", prefecture: "佐賀", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 784 },
  { store_code: 771, store_name: "札幌アピア", league: "J2", store_manager: "文東源", country: "", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 782 },
  { store_code: 594, store_name: "イオン都城", league: "J4", store_manager: "岩月勇樹", country: "", prefecture: "宮崎", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 780 },
  { store_code: 792, store_name: "神戸ハーバーランド umie", league: "J4", store_manager: "山下裕彰", country: "", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 776 },
  { store_code: 2154, store_name: "イオン東雲", league: "J5", store_manager: "鈴木誠", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 776 },
  { store_code: 772, store_name: "アミュプラザおおいた", league: "J3", store_manager: "工藤千尋", country: "", prefecture: "大分", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 772 },
  { store_code: 2204, store_name: "水戸エクセル", league: "J5", store_manager: "藤咲望光", country: "", prefecture: "茨城", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 772 },
  { store_code: 513, store_name: "イオンモール浜松市野", league: "J3", store_manager: "村田遼介", country: "", prefecture: "静岡", am: "平林真之", sv: "江口典成", area: "中部", max_capacity: 760 },
  { store_code: 630, store_name: "イオンタウン豊見城", league: "J5", store_manager: "赤嶺優香", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 760 },
  { store_code: 644, store_name: "レイクタウンアウトレット", league: "J3", store_manager: "滝沢陽向", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 760 },
  { store_code: 691, store_name: "新百合ヶ丘エルミロード", league: "J2", store_manager: "吉村奈々", country: "", prefecture: "神奈川", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 760 },
  { store_code: 729, store_name: "神戸ロフト", league: "J3", store_manager: "金晶", country: "", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 760 },
  { store_code: 605, store_name: "イオン大村", league: "J3", store_manager: "田中健一", country: "", prefecture: "長崎", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 756 },
  { store_code: 782, store_name: "星が丘テラス", league: "J4", store_manager: "永井 理香子", country: "", prefecture: "愛知", am: "平林真之", sv: "瀬古花穂", area: "中部", max_capacity: 756 },
  { store_code: 655, store_name: "ザ・ビッグ豊平", league: "J5", store_manager: "菊池俊宏", country: "", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 744 },
  { store_code: 789, store_name: "横浜ワールドポーターズ", league: "J5", store_manager: "徐晞桐", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 744 },
  { store_code: 616, store_name: "イオン大野城", league: "J2", store_manager: "松尾涼", country: "", prefecture: "福岡", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 743 },
  { store_code: 682, store_name: "イオンモール熱田", league: "J2", store_manager: "小澤幹太", country: "", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 732 },
  { store_code: 797, store_name: "横浜ポルタ", league: "J2", store_manager: "仲里幸笑", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 728 },
  { store_code: 2106, store_name: "千葉C・one", league: "J3", store_manager: "鷹箸久秀", country: "", prefecture: "千葉", am: "渡邉俊也", sv: "長優樹", area: "関東B", max_capacity: 728 },
  { store_code: 2192, store_name: "アトレ大船", league: "J5", store_manager: "野俣海人", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 728 },
  { store_code: 733, store_name: "三井アウトレットパーク札幌北広島", league: "J3", store_manager: "島中愛結菜", country: "", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 724 },
  { store_code: 497, store_name: "イオン本荘", league: "J4", store_manager: "松浦将", country: "", prefecture: "秋田", am: "渡邉俊也", sv: "金谷一義", area: "関東B", max_capacity: 720 },
  { store_code: 2155, store_name: "那覇OPA", league: "J5", store_manager: "新垣拓和", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 720 },
  { store_code: 734, store_name: "マロニエゲート銀座1", league: "J1", store_manager: "太田智美", country: "", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 704 },
  { store_code: 2153, store_name: "HAB＠熊本", league: "J5", store_manager: "伊東美羽", country: "", prefecture: "熊本", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 692 },
  { store_code: 735, store_name: "渋谷ロフト", league: "J2", store_manager: "マハルジャンサパナ", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 688 },
  { store_code: 543, store_name: "イオン唐津", league: "J3", store_manager: "西村美里", country: "", prefecture: "佐賀", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 684 },
  { store_code: 645, store_name: "サンリブもりつね", league: "J4", store_manager: "近藤全通", country: "", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 682 },
  { store_code: 472, store_name: "イオン茅ケ崎中央", league: "J5", store_manager: "松本光由", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 680 },
  { store_code: 626, store_name: "イオン名護", league: "J3", store_manager: "藤原章汰", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 680 },
  { store_code: 765, store_name: "イオンプラザ大島", league: "J4", store_manager: "繁野実佳", country: "", prefecture: "鹿児島", am: "熊野篤", sv: "黒木奨太", area: "九州B", max_capacity: 680 },
  { store_code: 535, store_name: "イオンモール福岡伊都", league: "J2", store_manager: "井上寛之", country: "", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 676 },
  { store_code: 537, store_name: "イオン若松", league: "J4", store_manager: "播磨雅彦", country: "", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 672 },
  { store_code: 712, store_name: "蔦屋書店名古屋みなと", league: "J4", store_manager: "高田洋輔", country: "", prefecture: "愛知", am: "平林真之", sv: "大野翔悟", area: "中部", max_capacity: 672 },
  { store_code: 652, store_name: "イオンもりの里", league: "J4", store_manager: "細野こよみ", country: "", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 670 },
  { store_code: 565, store_name: "本厚木", league: "J5", store_manager: "吉村奈々", country: "", prefecture: "神奈川", am: "谷口里美", sv: "吉村奈々", area: "関東A", max_capacity: 664 },
  { store_code: 585, store_name: "アル・プラザ鹿島", league: "J4", store_manager: "齋藤夏海", country: "", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 660 },
  { store_code: 2203, store_name: "イオンモール浦和美園", league: "J4", store_manager: "高橋 瑞希", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 650 },
  { store_code: 2215, store_name: "そよら長原駅前", league: "J5", store_manager: "いばら木 司", country: "", prefecture: "大阪", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 650 },
  { store_code: 2219, store_name: "新宿東口", league: "", store_manager: "陳美欽", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 648 },
  { store_code: 715, store_name: "イオン戸畑", league: "J5", store_manager: "前河泉輝", country: "", prefecture: "福岡", am: "熊野篤", sv: "内野さとみ", area: "九州B", max_capacity: 640 },
  { store_code: 2136, store_name: "ゆめタウンシティモール", league: "J5", store_manager: "古賀宇宙", country: "", prefecture: "熊本", am: "田口裕一朗", sv: "田口裕一朗", area: "九州A", max_capacity: 640 },
  { store_code: 2148, store_name: "サンエー大湾シティ", league: "J5", store_manager: "我如古孝弥", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 624 },
  { store_code: 741, store_name: "サンエー八重瀬シティ", league: "J5", store_manager: "粟国ひな子", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 620 },
  { store_code: 2208, store_name: "TIMETIMEゆめタウンサンピアン", league: "J5", store_manager: "村上翔", country: "", prefecture: "熊本", am: "田口裕一朗", sv: "太田原もも子", area: "九州A", max_capacity: 616 },
  { store_code: 2141, store_name: "船橋東武", league: "J4", store_manager: "熊木陽里", country: "", prefecture: "千葉", am: "渡邉俊也", sv: "小松原徳郎", area: "関東B", max_capacity: 608 },
  { store_code: 661, store_name: "イオン仙台中山", league: "J5", store_manager: "菅野雄大", country: "", prefecture: "宮城", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 600 },
  { store_code: 710, store_name: "KADENA AIR BASE", league: "J4", store_manager: "喜友名真美", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 600 },
  { store_code: 2175, store_name: "東急プラザ原宿「ハラカド」", league: "J3", store_manager: "市川創麻", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 600 },
  { store_code: 2189, store_name: "虎ノ門ヒルズ", league: "J4", store_manager: "吉野菜摘", country: "", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 600 },
  { store_code: 2213, store_name: "ゆめりあフェンテ大泉学園", league: "J4", store_manager: "菅沼優香", country: "", prefecture: "東京", am: "谷口里美", sv: "鈴木和典", area: "関東A", max_capacity: 600 },
  { store_code: 628, store_name: "ウィングベイ小樽", league: "J3", store_manager: "野口浩信", country: "", prefecture: "北海道", am: "田口裕一朗", sv: "佐々木淳一", area: "東日本", max_capacity: 596 },
  { store_code: 697, store_name: "上野マルイ", league: "J2", store_manager: "入沢友佳", country: "", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 592 },
  { store_code: 2201, store_name: "新綱島", league: "J5", store_manager: "ヒョウハク", country: "", prefecture: "神奈川", am: "谷口里美", sv: "梅津直貴", area: "関東A", max_capacity: 592 },
  { store_code: 566, store_name: "豊岡", league: "J5", store_manager: "杉本裕人", country: "", prefecture: "兵庫", am: "中田将也", sv: "石橋萌花", area: "西日本A", max_capacity: 576 },
  { store_code: 719, store_name: "近鉄上本町", league: "J3", store_manager: "金田和也", country: "", prefecture: "大阪", am: "中田将也", sv: "西本真実", area: "西日本A", max_capacity: 570 },
  { store_code: 784, store_name: "広島ゼロゲート", league: "J5", store_manager: "", country: "", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 560 },
  { store_code: 2157, store_name: "イオン小郡", league: "J4", store_manager: "米山瑠衣", country: "", prefecture: "福岡", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 552 },
  { store_code: 625, store_name: "イオンタウン読谷", league: "J5", store_manager: "兼久大空", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 540 },
  { store_code: 540, store_name: "イオン入間", league: "J3", store_manager: "廣木大輔", country: "", prefecture: "埼玉", am: "渡邉俊也", sv: "市村翔太", area: "関東B", max_capacity: 532 },
  { store_code: 686, store_name: "近鉄四日市", league: "J4", store_manager: "林孝枝", country: "", prefecture: "三重", am: "平林真之", sv: "平林真之", area: "中部", max_capacity: 504 },
  { store_code: 2230, store_name: "ミ・ナーラ", league: "J5", store_manager: "萬谷百竜", country: "", prefecture: "奈良", am: "中田将也", sv: "那須未雪", area: "西日本A", max_capacity: 500 },
  { store_code: 695, store_name: "イオンモールかほく", league: "J4", store_manager: "空手温志", country: "", prefecture: "石川", am: "平林真之", sv: "翁長那智", area: "中部", max_capacity: 492 },
  { store_code: 690, store_name: "LECT", league: "J3", store_manager: "", country: "", prefecture: "広島", am: "熊野篤", sv: "角田一幾", area: "西日本B", max_capacity: 476 },
  { store_code: 711, store_name: "FOSTER CONSESSIONS MALL", league: "J5", store_manager: "国場舞華", country: "", prefecture: "沖縄", am: "中田将也", sv: "高良美月", area: "沖縄", max_capacity: 460 },
  { store_code: 725, store_name: "イオン大塔", league: "J4", store_manager: "木場資視", country: "", prefecture: "長崎", am: "田口裕一朗", sv: "山浦大輔", area: "九州A", max_capacity: 460 },
  { store_code: 2123, store_name: "久米島", league: "J5", store_manager: "安里太介", country: "", prefecture: "沖縄", am: "中田将也", sv: "安里太介", area: "沖縄", max_capacity: 384 },
  { store_code: 2101, store_name: "OOTEMORI", league: "J5", store_manager: "王玉湖", country: "", prefecture: "東京", am: "渡邉俊也", sv: "慶田盛音夢", area: "関東B", max_capacity: 376 },
  { store_code: 451, store_name: "秋津", league: "J5", store_manager: "竹下久美子", country: "", prefecture: "東京", am: "渡邉俊也", sv: "吉本芹香", area: "関東B", max_capacity: 356 },
];

type SortDirection = "asc" | "desc" | null;

function getCapacityColor(cap: number) {
  if (cap >= 1500) return "text-emerald-600 font-bold";
  if (cap >= 1000) return "text-blue-600 font-bold";
  if (cap >= 700) return "text-amber-600 font-bold";
  return "text-rose-600 font-bold";
}

function getLeagueBadge(league: string) {
  const colors: Record<string, string> = {
    J1: "bg-yellow-100 text-yellow-800 border-yellow-200",
    J2: "bg-blue-100 text-blue-800 border-blue-200",
    J3: "bg-green-100 text-green-800 border-green-200",
    J4: "bg-purple-100 text-purple-800 border-purple-200",
    J5: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[league] || "bg-gray-100 text-gray-700 border-gray-200";
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between py-3 border-b border-border/40 last:border-0">
    <span className="text-sm font-medium text-muted-foreground w-32 shrink-0">{label}</span>
    <span className="text-sm font-semibold text-foreground text-right flex-1">{value || "—"}</span>
  </div>
);

export default function SVCapacity() {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [svFilter, setSvFilter] = useState("all");
  const [sortDir, setSortDir] = useState<SortDirection>(null);
  const [selected, setSelected] = useState<Store | null>(null);

  const areas = useMemo(() => {
    const set = new Set(STORES.map(s => s.area).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const svs = useMemo(() => {
    const set = new Set(STORES.map(s => s.sv).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    let result = STORES.filter(s => {
      const matchSearch = !search || s.store_name.toLowerCase().includes(search.toLowerCase()) || String(s.store_code).includes(search);
      const matchArea = areaFilter === "all" || s.area === areaFilter;
      const matchSv = svFilter === "all" || s.sv === svFilter;
      return matchSearch && matchArea && matchSv;
    });

    if (sortDir === "asc") result = [...result].sort((a, b) => a.max_capacity - b.max_capacity);
    else if (sortDir === "desc") result = [...result].sort((a, b) => b.max_capacity - a.max_capacity);

    return result;
  }, [search, areaFilter, svFilter, sortDir]);

  const toggleSort = () => {
    setSortDir(prev => prev === "desc" ? "asc" : prev === "asc" ? null : "desc");
  };

  const clearFilters = () => {
    setSearch("");
    setAreaFilter("all");
    setSvFilter("all");
    setSortDir(null);
  };

  const hasFilters = search || areaFilter !== "all" || svFilter !== "all" || sortDir;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">店舗キャパシティ管理</h1>
        <p className="mt-2 text-muted-foreground">全店舗のMax Capacityをエリア・SV別に確認・管理します。</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/20 rounded-xl border border-border/40">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="店舗名で検索..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-background h-9"
            data-testid="input-search"
          />
        </div>

        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-40 h-9 bg-background" data-testid="select-area">
            <SelectValue placeholder="エリア" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全エリア</SelectItem>
            {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={svFilter} onValueChange={setSvFilter}>
          <SelectTrigger className="w-40 h-9 bg-background" data-testid="select-sv">
            <SelectValue placeholder="SV" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全SV</SelectItem>
            {svs.map(sv => <SelectItem key={sv} value={sv}>{sv}</SelectItem>)}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground hover:text-foreground gap-1">
            <X className="h-3.5 w-3.5" /> クリア
          </Button>
        )}

        <span className="text-sm text-muted-foreground ml-auto font-medium">
          {filtered.length} / {STORES.length} 店舗
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="font-bold text-foreground w-24">店舗コード</TableHead>
              <TableHead className="font-bold text-foreground">店舗名</TableHead>
              <TableHead className="font-bold text-foreground w-28">エリア</TableHead>
              <TableHead className="font-bold text-foreground w-28">SV</TableHead>
              <TableHead className="font-bold text-foreground w-36">
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                  data-testid="button-sort-capacity"
                >
                  Max Capacity
                  {sortDir === "asc" ? (
                    <ArrowUp className="h-3.5 w-3.5 text-primary" />
                  ) : sortDir === "desc" ? (
                    <ArrowDown className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-10 w-10 mx-auto mb-3 text-border" />
                  <p className="font-medium">該当する店舗が見つかりません</p>
                  <p className="text-sm mt-1">検索条件を変更してください</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(store => (
                <TableRow
                  key={store.store_code}
                  className="cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setSelected(store)}
                  data-testid={`row-store-${store.store_code}`}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">{store.store_code}</TableCell>
                  <TableCell className="font-medium">{store.store_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium">{store.area}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{store.sv}</TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${getCapacityColor(store.max_capacity)}`}>
                      {store.max_capacity.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Panel */}
      <Sheet open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <SheetContent className="w-[400px] sm:w-[480px]">
          <SheetHeader className="pb-4 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg">{selected?.store_name}</SheetTitle>
                <SheetDescription className="text-xs font-mono">
                  店舗コード: {selected?.store_code}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selected && (
            <div className="py-4 space-y-0">
              <div className="mb-4 p-3 rounded-lg bg-secondary/30 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">Max Capacity</span>
                <span className={`text-2xl font-black font-mono ${getCapacityColor(selected.max_capacity)}`}>
                  {selected.max_capacity.toLocaleString()}
                </span>
              </div>

              {selected.league && (
                <div className="mb-4">
                  <Badge className={`border text-xs font-bold px-3 py-1 ${getLeagueBadge(selected.league)}`}>
                    {selected.league}
                  </Badge>
                </div>
              )}

              <DetailRow label="店舗名" value={selected.store_name} />
              <DetailRow label="都道府県" value={selected.prefecture} />
              <DetailRow label="エリア" value={selected.area} />
              <DetailRow label="SV" value={selected.sv} />
              <DetailRow label="AM" value={selected.am} />
              <DetailRow label="店長" value={selected.store_manager} />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
