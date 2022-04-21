import { Form } from "remix";

export default function Index() {
  return (
    <main className="h-screen">
      <section className="h-full flex flex-col justify-center items-center">
        <h1 className="my-8 text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          podcastic
        </h1>
        <h3 className="text-lg font-light">Search for a subject</h3>
        <Form className="w-80 p-4 flex-grow" action="/search">
          <input name="query" type="text" className="input" />
        </Form>
        <footer className="py-4">
          made by{" "}
          <a
            href="https://github.com/jensen"
            className="text-indigo-200 hover:text-pink-300"
          >
            @jensen
          </a>
        </footer>
      </section>
    </main>
  );
}
