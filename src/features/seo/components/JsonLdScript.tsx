/**
 * JSON-LD Script 注入組件
 *
 * 將結構化資料注入到頁面 head 中
 */

interface JsonLdScriptProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | Record<string, any>[];
}

/**
 * 注入單一或多個 JSON-LD 結構化資料
 *
 * @example
 * // 單一資料
 * <JsonLdScript data={generatePlaceJsonLd(place)} />
 *
 * // 多個資料
 * <JsonLdScript data={[generatePlaceJsonLd(place), generateBreadcrumbJsonLd(items)]} />
 */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  // 如果是陣列，每個項目產生一個 script tag
  if (Array.isArray(data)) {
    return (
      <>
        {data.map((item, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
      </>
    );
  }

  // 單一資料
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
