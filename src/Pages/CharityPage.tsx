import { useQuery } from "@tanstack/react-query";
import { CharityCard, type Charity } from "../Component/CharityCard";
import { getAllCharity } from "../Services/Charity.service";

function CharityPage() {
  const { isLoading, error, data } = useQuery<Charity[]>({
    queryKey: ["Charities"],
    queryFn: getAllCharity,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const charities = data ?? [];
  console.log(charities);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div>
      <div className="mx-auto mt-24 max-w-6xl w-full px-4 sm:px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charities.map((item, index) => (
            <CharityCard
              key={item.id}
              charity={item}
              featured={index === 1}
              onSelect={(id) => console.log("Selected charity:", id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CharityPage;
