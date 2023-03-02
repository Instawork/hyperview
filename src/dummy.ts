// consistent type definition rule
interface PET {
  name: string;
  sound: string;
}

const myPet = {
  name: 'cat',
  sound: 'meow',
};

// Unused var
const myOtherPet = {
  name: 'dog',
  sound: 'bark',
};

const myDummyFunction = () => {
  console.log('In myDummyFunction');
  console.log(myPet.purrs); // prop doesn't exist
};

// any type warning
function emitSound(somePet: any) {
  console.log(somePet.sound);
}

emitSound(myPet);

export { myDummyFunction };
