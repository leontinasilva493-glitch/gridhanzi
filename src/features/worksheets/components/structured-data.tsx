export function StructuredData({ data }: { data: object | object[] }) {
  // Safari's document parser can fail on otherwise valid top-level JSON-LD arrays.
  const entities = Array.isArray(data) ? data : [data];
  return <>{entities.map((entity, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entity).replace(/</g, "\\u003c") }}
    />
  ))}</>;
}
