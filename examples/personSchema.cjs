const {
  TextField,
  NumberField,
  BoolField,
  ArrayField,
  ObjectField,
  AsyncValidator,
} = require("../index.cjs");

async function sleep(seconds) {
  return new Promise((res) => {
    setTimeout(res, seconds * 1000);
  });
}

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
      .test(async () => {
        await sleep(1);
        return true;
      }),
    email: new TextField("Email")
      .require()
      .expr(/^[a-zA-Z_-]+@[a-zA-Z_-]+\.[a-zA-Z_-]{2,}/)
      .test(async () => {
        await sleep(1);
        return true;
      }),
    address: {
      country: new TextField("Country").require(),
      state: new TextField("State").require(),
      city: new TextField("City"),
      street: new TextField("Street"),
      locality: new TextField("Locality").test(async () => {
        await sleep(1);
        return true;
      }),
      zip: new TextField().require().expr(/^\d+$/),
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
  await validator.validate({
    name: { first: "First name" },
    gender: "male",
    ageInYears: 21,
    hobbies: [],
    isANerd: false,
    relationships: { someone: "someone" },
    contact: {
      phoneNo: "9082229626",
      email: "nitesh@xyz.com",
      address: {
        country: "India",
        state: "Tamilnadu",
        city: "Chennai",
        street: "VS mudali st",
        locality: "saidapet railway station",
        zip: "000000",
      },
    },
    employment: {
      company: "Zifo RnD",
      role: "Problem solver",
      previousRoles: ["Problem solver"],
      experienceInYears: 2,
    },
  });
})();
