export const AREA_SV_MASTER: Record<string, string[]> = {
  "関東A":   ["鈴木和典", "谷口里美", "吉村奈々"],
  "関東B":   ["渡邉俊也", "小松原徳郎", "長優樹", "吉本芹香", "金谷一義"],
  "中部":    ["江口典成", "瀬古花穂", "大野翔悟", "翁長那智", "平林真之"],
  "西日本A": ["那須未雪", "石橋萌花", "西本真実"],
  "西日本B": ["角田一幾"],
  "九州A":   ["山浦大輔", "太田原もも子", "内野さとみ", "黒木奨太", "田口裕一朗"],
  "沖縄":    ["安里太介", "中田将也"],
  "東日本":  ["佐々木淳一"],
};

export const VALID_AREAS = Object.keys(AREA_SV_MASTER);

export const ALL_VALID_SVS = [
  ...new Set(Object.values(AREA_SV_MASTER).flat()),
].sort();
