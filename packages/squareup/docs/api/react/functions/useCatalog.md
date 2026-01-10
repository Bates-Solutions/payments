[**@bates-solutions/squareup API Reference v0.2.0**](../../README.md)

***

[@bates-solutions/squareup API Reference](../../README.md) / [react](../README.md) / useCatalog

# Function: useCatalog()

> **useCatalog**(`options`): [`UseCatalogReturn`](../interfaces/UseCatalogReturn.md)

Defined in: [src/react/hooks/useCatalog.ts:112](https://github.com/mbates/squareup/blob/483fcbcf6cfb72e7fa9b0c8ff55c0a7f670262a1/src/react/hooks/useCatalog.ts#L112)

Hook for accessing catalog data via your backend API

## Parameters

### options

[`UseCatalogOptions`](../interfaces/UseCatalogOptions.md) = `{}`

Hook configuration

## Returns

[`UseCatalogReturn`](../interfaces/UseCatalogReturn.md)

Catalog query functions and state

## Example

```tsx
function ProductList() {
  const { data: items, loading, error, search } = useCatalog({
    initialOptions: { objectTypes: ['ITEM'], limit: 20 },
    fetchOnMount: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        onChange={(e) => search({ query: e.target.value })}
        placeholder="Search products..."
      />
      <ul>
        {items?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```
