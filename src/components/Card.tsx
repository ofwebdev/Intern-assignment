"use client"
import React, { useState, useEffect } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const query = `
  query {
    pokemons(limit: 10) {
      results {
        id
        url
        name
        image
        artwork
        dreamworld
        __typename
      }
      status
    }
    types {
      count
      results {
        name
        id
      }
    }
  }
`;


interface PokemonResult {
  id: string;
  url: string;
  name: string;
  image: string;
  artwork: string;
  dreamworld: string;
  __typename: string;
}

interface PokemonResponse {
  results: PokemonResult[];
  status: string;
}

interface TypeResult {
  name: string;
  id: string;
}

interface TypeResponse {
  count: number;
  results: TypeResult[];
}

interface GraphQLResponse {
  data: {
    pokemons: PokemonResponse;
    types: TypeResponse;
  };
}



function Card() {

  const [pokemons, setPokemons] = useState<PokemonResult[]>([]);
  const [types, setTypes] = useState<TypeResult[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    // https://api.pikaserve.xyz/pokemon/all
    fetch('https://graphql-pokeapi.graphcdn.app/', {
      credentials: 'omit',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
      }),
      method: 'POST',
    })
      .then((res) => res.json())
      .then((res: GraphQLResponse) => {
        setPokemons(res.data.pokemons.results);
        setTypes(res.data.types.results);
      });
  }, []);


  

  return (
    <>
      {isMobile ?
        <>
          <Carousel
            additionalTransfrom={0}
            arrows
            autoPlaySpeed={3000}
            centerMode={true}
            className=""
            containerClass="container"
            dotListClass=""
            draggable={true}
            focusOnSelect={false}
            infinite={false}
            itemClass="m-5"
            keyBoardControl
            minimumTouchDrag={80}
            pauseOnHover
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 0,
                },
                items: 4,
                partialVisibilityGutter: 20
              },
              mobile: {
                breakpoint: {
                  max: 464,
                  min: 0
                },
                items: 1,
                partialVisibilityGutter: 20
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 464
                },
                items: 2,
                partialVisibilityGutter: 20
              }
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            showDots={false}
            sliderClass=""
            slidesToSlide={1}
            swipeable
          >


            {pokemons.map((pokemon) => (
              <>


                <div key={pokemon.id} className='bg-slate-50 pb-8 border-bottom-right-radius group p-3 rounded-md hover:bg-cyan-500 transition-all'>
                  <div className="mb-6 bg-slate-100 p-4 rounded-md">
                    <span className='font-semibold'>#{pokemon.id}</span>
                    <img className='w-full group-hover:scale-125 transition ease-in-out delay-150' src={pokemon.image} alt="" />
                  </div>

                  <h3 className='capitalize font-semibold'>{pokemon.name} </h3>
                </div>

              </>
            ))}
          </Carousel>
        </> :
        <>
          <div className='grid grid-cols-1 gap-10 my-10 m-5 md:m-0 md:grid-cols-5'>
            {pokemons.map((pokemon) => (
              <>
                <div key={pokemon.id} className='bg-slate-50 pb-8 border-bottom-right-radius group p-3 rounded-md hover:bg-cyan-500 transition-all'>
                  <div className="mb-6 bg-slate-100 p-4 rounded-md">
                    <span className='font-semibold'>#{pokemon.id}</span>
                    <img className='w-full group-hover:scale-125 transition ease-in-out delay-150' src={pokemon.image} alt="" />
                  </div>

                  <h3 className='capitalize font-semibold'>{pokemon.name} </h3>
                </div>
              </>
            ))}
          </div>
        </>
      }
    </>
  );
};

export default Card;
