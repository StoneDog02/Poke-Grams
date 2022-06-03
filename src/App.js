import "./styles.css";
import { useEffect, useState } from "react";

function saveTheFirstChoice(choiceIndex, firstChoice, setFirstChoice) {
  if (firstChoice === null) {
    setFirstChoice(choiceIndex);
  }
}

function saveTheSecondChoice(
  choiceIndex,
  firstChoice,
  secondChoice,
  setSecondIndex
) {
  if (firstChoice !== null && secondChoice === null) {
    setSecondIndex(choiceIndex);
  }
}

function swapIndexes(shuffleChars, setShuffleChars, firstIndex, secondIndex) {
  const placeholder = shuffleChars[firstIndex];
  shuffleChars[firstIndex] = shuffleChars[secondIndex];
  shuffleChars[secondIndex] = placeholder;
  setShuffleChars([...shuffleChars]);
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

function PokemonShadow({ pokemonImg }) {
  return <img src={pokemonImg} alt="A pokemon's shadow" />;
}

function PokemonName({
  pokemonNameCharsShuffled,
  handleButtonClick,
  pokemonNameChars,
  activeIndex
}) {
  return pokemonNameCharsShuffled?.map((letter, index) => (
    <button
      key={`${index}-${letter}`}
      className={`${letter === pokemonNameChars[index] ? "correct" : ""} ${
        activeIndex === index ? "active" : ""
      }`}
      onClick={() => handleButtonClick(letter, index)}
    >
      {letter}
    </button>
  ));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max + 1);
}

function PlayAgain({ onClick }) {
  return (
    <div class="modal">
      <h3>Yay! You did it.</h3>
      <button onClick={onClick}>Play Again?</button>
    </div>
  );
}

export default function App() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function getPokemon() {
      const randomNumber = getRandomInt(151);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomNumber}`
        // `https://pokeapi.co/api/v2/pokemon/25`
      );
      const data = await response.json();
      setPokemon(data);
    }
    if (pokemon === null) {
      getPokemon();
    }
  }, [pokemon]);

  const [shuffleChars, setShuffleChars] = useState([]);
  useEffect(() => {
    if (pokemon !== null) {
      setShuffleChars(shuffle(pokemon.name.split(``)));
    }
  }, [pokemon]);
  const [firstIndex, setFirstIndex] = useState(null);
  const [secondIndex, setSecondIndex] = useState(null);
  function handleButtonClick(letter, index) {
    saveTheFirstChoice(index, firstIndex, setFirstIndex);
    saveTheSecondChoice(index, firstIndex, secondIndex, setSecondIndex);
  }

  useEffect(() => {
    if (firstIndex !== null && secondIndex !== null) {
      swapIndexes(shuffleChars, setShuffleChars, firstIndex, secondIndex);
      setFirstIndex(null);
      setSecondIndex(null);
    }
  }, [firstIndex, secondIndex, shuffleChars]);

  return (
    <div className="App">
      <div>
        <h1>PokeGrams</h1>
        <h2>Can you guess 'em all?</h2>
      </div>
      {pokemon ? (
        <>
          <div className="container">
            <div className="inner-container">
              <PokemonShadow
                pokemonImg={
                  pokemon !== null ? pokemon.sprites.front_default : null
                }
              />
            </div>
          </div>
          <div>
            <PokemonName
              handleButtonClick={handleButtonClick}
              pokemonNameCharsShuffled={shuffleChars}
              pokemonNameChars={pokemon?.name.split(``)}
              activeIndex={firstIndex}
            />
          </div>
        </>
      ) : null}
      {shuffleChars.join("") === pokemon?.name ? (
        <PlayAgain onClick={() => setPokemon(null)} />
      ) : null}
    </div>
  );
}
