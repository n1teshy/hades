const {
  TextField,
  NumberField,
  BoolField,
  ArrayField,
  ObjectField,
  AsyncValidator,
} = require("../index.cjs");

// this file implements validation for a person's data

// a copy of python's sleep function, to simulate the time spent
// doing asynchronous jobs i.e api calls, file reads etc
async function sleep(seconds) {
  return new Promise((res) => {
    setTimeout(res, seconds * 1000);
  });
}

// define fields to check in data
const personSchema = {
  name: {
    first: new TextField("First name").require(),
    last: new TextField("Last name"),
  },
  gender: new TextField("Gender").require(),
  ageInYears: new NumberField("Age in years").require().whole().min(21),
  hobbies: new ArrayField("Hobbies")
    .require()
    .each(
      (hobby) => typeof hobby === "string",
      (hobby) => `really bro? you got a hobby that is a ${typeof hobby}`,
    )
    .test(async () => {
      await sleep(1);
      return true;
    }),
  isANerd: new BoolField("Nerd?").require(),
  relationships: new ObjectField("Relationships").require().each(
    (key, value) =>
      ["gf", "bf", "girlfriend", "boyfriend"].indexOf(value) === -1,
    (key, value) => `who you foolin' bro? I know you don't have a ${value}`,
  ),
  contact: {
    phoneNo: new TextField("Phone number")
      .require()
      .min(10)
      .max(11)
      .expr(/^\d+$/)
      .test(async (phoneNo) => {
        await sleep(1);
        // phone number must include one of the universal constants
        return phoneNo.includes("69") || phoneNo.includes("420");
      }, "gotta have those constants bro"),
    email: new TextField("Email")
      .require()
      .expr(/^[a-zA-Z_-]+@[a-zA-Z_-]+\.[a-zA-Z_-]{2,}/)
      .test(async (email) => {
        await sleep(1);
        return email.includes("chad");
      }, "email is not chad enough"),
    address: {
      country: new TextField("Country").require(),
      state: new TextField("State").require(),
      city: new TextField("City"),
      street: new TextField("Street"),
      locality: new TextField("Locality").test(async () => {
        await sleep(1);
        return true;
      }),
      zip: new TextField("Zip").require().expr(/^\d+$/),
    },
  },
  employment: {
    company: new TextField("Company").require(),
    role: new TextField("Role").require(),
    previousRoles: new ArrayField("Previous roles").require().min(1),
    experienceInYears: new NumberField("Experience in years").require().min(1),
  },
};

const validator = new AsyncValidator(personSchema);

(async () => {
  const nerdData = {
    name: { first: "measly", last: "nerd" },
    gender: "male",
    ageInYears: 21,
    hobbies: ["not seeing sunlight for days"],
    isANerd: true, // duh
    relationships: { unknownRedditor: "fwend", imaginaryGirl: "gf" },
    contact: {
      phoneNo: "3141592653",
      email: "nerd@home.com",
      address: {
        country: "India",
        state: "Ohio",
        city: "random city",
        street: "random street",
        locality: "random locality",
        zip: "000000",
      },
    },
    employment: {
      company: "random company",
      role: "random role",
      previousRoles: ["ramdom roles"],
      experienceInYears: 2,
    },
  };
  // eslint-disable-next-line no-console
  console.log(await validator.validate(nerdData));
  /* prints
  {
    relationships: "who you foolin' bro? I know you don't have a gf",
    contact: {
      phoneNo: 'gotta have those constants bro',
      email: 'email is not chad enough'
    }
  }
  */
})();
