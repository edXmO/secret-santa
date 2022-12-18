<script lang="ts">
  import { getApp } from "firebase/app";
  import {
    connectFunctionsEmulator,
    getFunctions,
    httpsCallable,
  } from "firebase/functions";
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import "./app.css";
  import Carousel from "./lib/Carousel.svelte";
  import Modal from "./lib/Modal.svelte";
  import Spinner from "./lib/Spinner.svelte";

  const app = getApp();
  const functions = getFunctions(app, "europe-west1");
  process.env.NODE_ENV === "development" &&
    connectFunctionsEmulator(functions, "localhost", 5001);

  let endDate = "2022-12-24T23:59:59.999Z";
  let name = "";
  let email = "";
  let tos = false;
  let modal;
  let registered = false;
  let loading = false;

  let countDownDate = new Date(endDate).getTime();

  // create a date object for the date 24/12/2022 at 21:00:00
  let limitDate = new Date("Dec 24, 2022 21:00:00");

  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  var x = setInterval(function () {
    var now = new Date().getTime();
    var distance = countDownDate - now;
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }, 1000);

  $: timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;

  async function register() {
    const registerParticipant = httpsCallable(functions, "registerParticipant");
    if (!email || !name || !tos) {
      return console.log("no email");
    }

    loading = true;

    try {
      const res: { data: { message?: string } } = await registerParticipant({
        name,
        email,
      });

      if (res?.data?.message === "User created successfully") {
        registered = true;
        loading = false;
        name = "";
        email = "";
        tos = false;
      } else {
        loading = false;
        registered = false;
        name = "";
        email = "";
        tos = false;
      }
    } catch (error) {
      console.log({ error });
      loading = false;
      registered = false;
      name = "";
      email = "";
      tos = false;
    }
  }

  onDestroy(() => clearInterval(x));
</script>

<main
  class="flex flex-col items-center justify-center min-w-full overflow-x-hidden"
>
  <Carousel />
  <section
    class="flex flex-1 flex-col items-center justify-center w-full pt-14 overflow-y-hidden"
  >
    <h1
      in:fly={{ delay: 65, y: -20 }}
      class="relative text-6xl font-extrabold w-2/3 text-center"
    >
      Amigo Invisible
      <h1 in:fly={{ delay: 130, y: -20 }} class="text-indigo-600">Machines</h1>
    </h1>
    <h1
      in:fly={{ delay: 320, y: -20 }}
      class="text-md font-extrabold w-2/3 text-center pt-4"
    >
      2022 Ed.
    </h1>
    <div class="flex flex-col gap-8 pt-24 pb-28 items-center justify-around">
      <p class="font-extrabold text-2xl text-center px-4">
        ¡Únete a la fiesta de Navidad más divertida!
      </p>
      <div class="flex flex-col items-center">
        <span class="font-extrabold text-3xl">{timeLeft}</span>
        <p class="font-semibold text-lg">para el sorteo</p>
      </div>

      <!-- <p class="font-extrabold text-3xl">{timeLeft}</p> -->
      <button
        on:click={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          });
        }}
        class="flex flex-row py-4 px-6 w-40 bg-indigo-600 rounded-md items-center justify-between"
      >
        <p class="font-semibold">Incríbete</p>
        <!-- arrow right icon -->
        <svg
          class="w-6 h-6 ml-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </button>
    </div>

    <div class="flex flex-col items-center justify-around gap-2 md:w-96 w-4/5">
      <h1 class="text-3xl font-bold text-center py-6">
        Ubicación y día del evento
      </h1>
      <p class="font-semibold font-xl py-4">02/01/2023</p>
      <button
        on:click={() =>
          window.open(
            "https://www.google.es/maps/place/Mar+y+Tierra/@40.4557361,-3.6806853,17z/data=!3m2!4b1!5s0xd4228f73df22e61:0xa09ddf4d464978e7!4m5!3m4!1s0xd422920bf7c53ed:0xa50189431792a333!8m2!3d40.4557361!4d-3.6784966?hl=es",
            "_blank"
          )}
        class="flex py-4  w-full bg-slate-800 border-indigo-600 border-2 rounded-md items-center justify-around"
      >
        <p class="font-semibold">Restaurante Mar & Tierra</p>
        <!-- location icon -->
        <svg
          class="w-6 h-6 ml-2 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"
          />
        </svg>
      </button>
    </div>

    <div class="flex flex-col pb-20 pt-32 w-full px-12 items-center">
      <h1 class="text-3xl font-bold text-center pb-12">Evento</h1>
      <div
        class="flex flex-1 justify-center lg:flex-row flex-col gap-14 w-full"
      >
        <div
          class="flex  flex-col bg-slate-800 h-full lg:w-96 lg:min-h-96 lg:pb-32 border-indigo-600 border-2  rounded-md"
        >
          <div
            class="flex items-center justify-start h-20 px-6 border-b-indigo-600 border-b-2 border-dashed"
          >
            <p class="font-bold text-lg md:text-2xl">
              Premios Cabrones Machine
            </p>
          </div>
          <div class="p-6">
            <ul>
              <li class="pb-4 pt-4 text-xl">
                Se entregará un premio al final del evento a cada uno de los
                participantes.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- create an if statement that will show this block of code only if the date is before limitDate -->
    {#if new Date().getTime() < limitDate.getTime()}
      <h1 class="text-3xl font-bold text-center pb-10 pt-32">
        Introduce tu nombre e email para participar
      </h1>
      <div class="flex flex-col gap-8 pt-4 md:w-96 w-4/5">
        <input
          type="text"
          placeholder="Nombre..."
          class="h-14 rounded-xl bg-slate-800 placeholder-slate-700 text-inherit font-semibold outline-none border-indigo-600 border-[1px] px-6 focus:ring-2 focus:ring-indigo-600 active:ring-indigo-600 transition-all duration-300"
          bind:value={name}
        />
        <input
          disabled={tos}
          type="email"
          placeholder="Email..."
          class="h-14 rounded-xl bg-slate-800 placeholder-slate-700 text-inherit font-semibold outline-none border-indigo-600 border-[1px] px-6 focus:ring-2 focus:ring-indigo-600 active:ring-indigo-600 transition-all duration-300"
          bind:value={email}
        />

        <button
          disabled={!tos || !email || !name}
          on:click={() => modal.show()}
          type="submit"
          class="h-12 rounded-xl text-inherit font-semibold bg-indigo-600 disabled:opacity-60 transition-all duration-250 ease-in-out"
        >
          Participar
        </button>
        <div
          class="flex flex-row items-center justify-evenly py-6 gap-2 lg:w-full"
        >
          <input
            bind:value={tos}
            class="w-6 h-6 bg-slate-800 border-indigo-600 outline-none rounded-md cursor-pointer  checked:bg-indigo-600 active:ring-indigo-600 active:bg-transparent focus:ring-2 focus: ring-indigo-600 transition-all duration-300"
            type="checkbox"
          />
          <span class="font-semibold text-center">
            He leído y acepto los <button
              disabled={registered}
              on:click={() => {
                modal.show();
              }}
              class="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors duration-150 ease-in"
              >Términos y Condiciones</button
            >
          </span>
        </div>
      </div>
    {:else}
      <h1 class="text-2xl font-bold text-center pb-10 pt-20 px-8">
        La fecha límite para participar ha finalizado. ¡Gracias por participar!
      </h1>
      <pre class="text-indigo-600">
        _\/_
         /\
         /\
        /  \
       /~~  \o
      /o     \
     / ~~*~~~ \
    /    o     \
   /~~~~~~~~    \~`
  /__*_ _______ _\
         ||
       \====/
        \__/
    </pre>
    {/if}
    <div
      class="flex flex-col items-center justify-center w-full h-20 pt-12 pb-8"
    >
      <p class="text-center text-slate-300">
        Made with <span class="text-red-600">❤</span> by
        <a
          href="https://twitter.com/eddXmO"
          target="_blank"
          rel="noopener noreferrer"
          alt="Twitter"
          class="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors duration-150 ease-in"
          >@edXmO</a
        >
      </p>
    </div>
  </section>
  <Modal bind:this={modal}>
    {#if !loading && !registered}
      <div
        class="flex justify-between bg-indigo-600 rounded-tl-md rounded-tr-md w-full h-20 items-center px-8"
      >
        <h1 class="text-xl font-semibold">Términos y Condiciones</h1>
      </div>
      <div class="flex flex-col h-2/3 w-full px-8 py-4 my-2 overflow-y-scroll">
        <ol class="flex pt-6 pb-16 flex-col gap-4">
          <li in:fly={{ y: 20, delay: 50 }} class="font-semibold text-xl">
            <span class="text-indigo-600">1.</span> Mantenlo en secreto.
          </li>
          <li in:fly={{ y: 20, delay: 100 }} class="font-semibold text-xl">
            <span class="text-indigo-600">2.</span> El precio del regalo deberá mantenerse
            entre los 5-15€.
          </li>
          <li in:fly={{ y: 20, delay: 150 }} class="font-semibold text-xl">
            <span class="text-indigo-600">3.</span> Es preferible que el regalo no
            esté vivo. O muerto.
          </li>
          <li in:fly={{ y: 20, delay: 200 }} class="font-semibold text-xl">
            <span class="text-indigo-600">4.</span> Intenta ser creativo y original.
            La elaboración de un regalo de forma artesanal es muy valorada.
          </li>
          <li in:fly={{ y: 20, delay: 250 }} class="font-semibold text-xl">
            <span class="text-indigo-600">5.</span> Mantenlo en secreto.
          </li>
          <li in:fly={{ y: 20, delay: 300 }} class="font-semibold text-xl">
            <span class="text-indigo-600">6.</span> Nada de soportes para cargadores.
          </li>
          <li in:fly={{ y: 20, delay: 350 }} class="font-semibold text-xl">
            <span class="text-indigo-600">7.</span> No tener la piel fina.
          </li>
        </ol>
      </div>
      <div class="flex flex-col justify-around h-32 px-10">
        <button
          disabled={!tos || !name || !email}
          class="items-center justify-center h-42 w-full disabled:bg-indigo-800 bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-800 transition-all duration-150 ease-in"
          on:click={() => {
            register().catch(() => {
              modal.hide();
            });
          }}
        >
          Aceptar
        </button>
        <button
          class="bg-slate-700 w-full text-slate-800 font-bold py-2 px-6 rounded-md hover:text-slate-200 transition-all duration-150 ease-in"
          on:click={() => {
            modal.hide();
          }}
        >
          Cerrar
        </button>
      </div>
    {:else if loading}
      <div
        class="flex flex-col h-full w-full overflow-y-hidden self-center items-center justify-center"
      >
        <Spinner />
        <h1 class="text-2xl font-semibold text-center pt-16">
          Solicitando registro...
        </h1>
      </div>
    {:else if !loading && registered}
      <div class="flex flex-col w-full h-full">
        <div
          class="flex flex-col h-full w-full overflow-x-hidden overflow-y-hidden self-center items-center justify-evenly"
        >
          <h1 class="text-2xl font-semibold text-center">
            ¡Gracias por participar!
          </h1>
          <iframe
            src="https://giphy.com/embed/jJQC2puVZpTMO4vUs0"
            width="320"
            height="260"
            title="GIF"
            frameBorder="1"
            class="giphy-embed"
            allowFullScreen={false}
          />
          <!-- <p><a href="https://giphy.com/gifs/jJQC2puVZpTMO4vUs0">via GIPHY</a></p> -->
          <p class="text-xl font-semibold text-center px-6">
            Te hemos enviado un email con los detalles de tu participación y
            confirmación de registro.
          </p>
        </div>
        <button
          class="bg-slate-700 w-11/12 mb-4 self-center text-slate-800 font-bold py-2 px-6 rounded-md hover:text-slate-200 transition-all duration-150 ease-in"
          on:click={() => {
            modal.hide();
          }}
        >
          Cerrar
        </button>
      </div>
    {/if}
  </Modal>
</main>
