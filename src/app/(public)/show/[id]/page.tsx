import { useFetch } from "@/hooks/useFetch";
import { IProduct } from "@/models/Product";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShowPage({ params }: PageProps) {
  const { id } = await params;
  const {fetchApi }= useFetch()

  const products = await fetchApi<IProduct>(`${process.env.NEXTAUTH_URL}/api/products/${id}`)

  return (
    <div>
      <h1>Show Page</h1>
      <p>ID: {id}</p>
      <p>Product Name: {products.name}</p>
      <p>Product Qty: {products.qty}</p>
    </div>
  );
}
