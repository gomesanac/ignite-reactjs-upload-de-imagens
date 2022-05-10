import { Button, Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async ({ pageParam = null }) => {
      const response = await api.get(`/api/images`, {
        params: { after: pageParam },
      });

      return response.data;
    },
    { getNextPageParam: lastPage => lastPage.after || null }
  );

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });

    return formatted;
  }, [data]);

  if (isLoading && !isError) return <Loading />;

  if (!isLoading && isError) return <Error />;

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {formattedData.length > 0 ? (
          <CardList cards={formattedData} />
        ) : (
          <Text textAlign="center" fontSize="2xl" fontWeight="bold">
            Nenhuma imagem cadastrada até o momemnto.
          </Text>
        )}

        {hasNextPage && (
          <Button
            bg="orange.500"
            color="pGray.50"
            py={6}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            mt={10}
          >
            {!isFetchingNextPage ? 'Carregar mais' : 'Carregando...'}
          </Button>
        )}
      </Box>
    </>
  );
}
