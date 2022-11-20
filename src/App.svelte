<script lang="ts">
  import { onDestroy } from "svelte";
  import { fly } from "svelte/transition";
  import "./app.css";
  import Modal from "./lib/Modal.svelte";

  let endDate = "2022-12-24T23:59:59.999Z";
  let email = "";
  let tos = false;
  let modal;
  $: disabled = !email || !tos;

  let countDownDate = new Date(endDate).getTime();
  console.log({ countDownDate });
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

  onDestroy(() => clearInterval(x));
</script>

<main class="flex flex-col items-center justify-center min-w-full min-h-screen">
  <section
    class="flex flex-1 flex-col items-center justify-center w-full pt-14"
  >
    <h1
      in:fly={{ delay: 65, y: -20 }}
      class="relative text-6xl font-extrabold w-2/3 text-center"
    >
      Amigo Invisible <h1
        in:fly={{ delay: 130, y: -20 }}
        class="text-indigo-600"
      >
        Machines
      </h1>
      <img
        in:fly={{ delay: 260, y: -20 }}
        alt="maracas"
        class="absolute top-16 right-72 rotate-45"
        src="/maracas-svgrepo-com.svg"
      />
    </h1>
    <h1
      in:fly={{ delay: 320, y: -20 }}
      class="text-sm font-extrabold w-2/3 text-center mb-4"
    >
      2022 Ed.
    </h1>
    <div class="flex flex-row h-24 items-center justify-around">
      <p class="font-extrabold text-3xl">{timeLeft}</p>
    </div>

    <div class="flex flex-col gap-8 pt-4 md:w-96 w-4/5">
      <input
        type="email"
        placeholder="Ingresa tu email..."
        class="h-14 rounded-xl bg-slate-800 placeholder-slate-700 text-inherit font-semibold outline-none border-indigo-600 border-[1px] px-6 focus:ring-2 focus:ring-indigo-600 active:ring-indigo-600 transition-all duration-300"
        bind:value={email}
      />
      <button
        {disabled}
        type="submit"
        class="h-12 rounded-xl text-inherit font-semibold bg-indigo-600 disabled:opacity-60 transition-all duration-250 ease-in-out"
      >
        Participar
      </button>
    </div>
    <div
      class="flex flex-row items-center justify-around py-6 gap-2 md:w-96 w-4/5"
    >
      <input
        on:click={() => {
          if (!tos) {
            modal.show();
            tos = false;
          }
        }}
        class="w-6 h-6 bg-slate-800 border-indigo-600 outline-none rounded-md cursor-pointer  checked:bg-indigo-600 active:ring-indigo-600 active:bg-transparent focus:ring-2 focus: ring-indigo-600 transition-all duration-300"
        type="checkbox"
      />
      <span class=" font-semibold text-center">
        He leído y acepto los <button
          class="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors duration-150 ease-in"
          >Términos y Condiciones</button
        >
      </span>
    </div>
  </section>
  <section class="flex flex-col items-center w-screen overflow-x-hidden">
    <h1 class="font-semibold text-xl">Patrocinado por</h1>
    <div class="flex flex-col py-4 flex-1 items-center">
      <div class="relative flex flex-1 overflow-x-hidden">
        <div class="py-12 animate-marquee whitespace-nowrap">
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Patanel</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Doña Patata</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Hidalgo</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Bar Alfonsillo</span
          >
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Trust Fitness Center
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Colegio Santa María del Bosque
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            La Cortá
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            D'Neto
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Pqa. San Miguel Arcángel
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Island Club
          </span>
        </div>
        <div
          class="absolute top-0 py-12 animate-marquee2 whitespace-nowrap group"
        >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Patanel</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Doña Patata</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Hidalgo</span
          >
          <span
            class="mx-12 cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Bar Alfonsillo</span
          >
          <span
            class="mx-12  cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
            >Trust Fitness Center</span
          >
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Colegio Santa María del Bosque
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            La Cortá
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            D'Neto
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Pqa. San Miguel Arcángel
          </span>
          <span
            class="mx-12 relative h-full cursor-pointer text-3xl hover:text-indigo-600 transition-all duration-150 ease-in"
          >
            Island Club
          </span>
        </div>
      </div>
    </div>
  </section>
  <Modal bind:this={modal}>
    <div
      class="flex justify-between bg-indigo-600 w-full h-20 items-center px-8"
    >
      <h1 class="text-xl font-semibold">Términos y Condiciones</h1>
      <button
        class="bg-slate-800 text-slate-600 font-bold py-2 px-6 rounded-md hover:text-slate-200 transition-all duration-150 ease-in"
        on:click={() => modal.hide()}
      >
        Cerrar
      </button>
    </div>
    <div class="flex flex-col h-full w-full p-10">
      <ol class="flex pt-6 pb-16 flex-col gap-4">
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">1.</span> Mantenlo en secreto.
        </li>
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">2.</span> El precio del regalo deberá mantenerse
          entre los 5-15€.
        </li>
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">3.</span> Es preferible que el regalo no
          esté vivo. O muerto.
        </li>
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">4.</span> Intenta ser creativo y original.
          No es lo mismo un regalo que otro.
        </li>
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">5.</span> Mantenlo en secreto.
        </li>
        <li class="font-semibold text-xl">
          <span class="text-indigo-600">6.</span> Nada de soportes para cargadores.
        </li>
      </ol>
      <button
        class="items-center justify-center w-full h-42 bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-800 transition-all duration-150 ease-in"
        on:click={() => {
          modal.hide();
          tos = true;
        }}
      >
        Aceptar
      </button>
    </div>
  </Modal>
</main>

<style>
</style>
