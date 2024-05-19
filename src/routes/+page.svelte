<script>
  import { Heading, DarkMode, Navbar, NavBrand, Footer, FooterCopyright, Alert, Dropzone } from 'flowbite-svelte';
  import { CloudArrowUpOutline, InfoCircleSolid } from "flowbite-svelte-icons";

  import JSZip from "jszip";
  import { base } from '$app/paths'

  let file = null;
  let state = "green";
  let message = "";

  const dropHandle = (event) => {
    event.preventDefault();
    const items = event.dataTransfer.items ? [...event.dataTransfer.items] : [...event.dataTransfer.files];
    
    for (let item of items) {
      if (item.kind === 'file' || item instanceof File) {
        file = item.kind === 'file' ? item.getAsFile() : item;
        break;
      }
    }

    checkFile();
  };

  const handleChange = (event) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles.length > 0) {
      file = uploadedFiles[0];
    }

    checkFile();
  };

  const checkFile = () => {
    // check extensions
    if (file.type !== "application/java-archive" && file.type !== "application/x-java-archive" && file.type !== "application/x-jar") {
      state = "red"
      message = `The file "${file.name}" is not a jar.`
      return;
    }

    // read zip file
    let zip = new JSZip();
    JSZip.loadAsync(file).then((zip) => {
      zip.file("META-INF/MANIFEST.MF").async("string").then(
        (data) => {
          state = "green";
          
          if (data.includes("FML")) {
            message = `The file "${file.name} is a Forge mod client"`
          } else if (data.includes("Fabric")) {
            message = `The file "${file.name} is a Fabric mod client"`
          } else {
            message = `The file "${file.name} is a MCP Version Client or an unknown jar."`
          }

          console.log(data);
        }, (e) => {
          state = "green";
          message = `The file "${file.name} is a MCP Version Client or an unknown jar."`
        })


    }, (e) => {
      state = "red";
      message = `The file "${file.name}" can not read.`
    });

  }

</script>

<div class="flex flex-col items-center text-center">

  <header class="mb-4 px-6 w-full mx-auto top-0 z-40">
    <Navbar color="none" fluid>
      <NavBrand href="{base}/">
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Jar Client Checker</span>
      </NavBrand>
      <DarkMode />
    </Navbar>
  </header>

  {#if file}
  <Alert border color={state} class="w-4/5 h-12 mb-6 dark:bg-gray-700 border-2">
    <InfoCircleSolid slot="icon" class="w-5 h-5" />
    {message}
  </Alert>
  {/if}

  <div class="w-4/5 h-96 flex items-center justify-center mb-12">
    <Dropzone 
    id="dropzone" 
    on:drop={dropHandle} 
    on:dragover={(e) => e.preventDefault()} 
    on:change={handleChange} 
    class="h-full">
    <CloudArrowUpOutline class="w-12 h-12 mb-4 text-gray-500 dark:text-gray-40" />
    <p class="mb-2 text-lg text-gray-500 dark:text-gray-400">
      <span class="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p class="text-md text-gray-500 dark:text-gray-400">JAR file</p>
  </Dropzone>
</div>

<Footer>
  <FooterCopyright href="{base}/" by="MinusMC™" year={2024} />
</Footer>

</div>
