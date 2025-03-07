import { useState, useEffect } from "react";
import TreeForceGraph from "./TreeForceGraph";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebaseConfig";

async function readDocuments(collectionName) {
  const docRef = doc(db, collectionName, "sR1pzBxCcGmaPZhFKzrp");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().token;
  } else {
    return false;
  }
}

/**
 * Función que realiza un fetch a la API de GitHub para obtener el contenido
 * de una ruta dada del repositorio.
 */
async function fetchRepoContents(path = "") {
  // Configura aquí el owner y repo deseados
  const owner = "dardocam";
  const repo = "tecpro-planning";
  const token = await readDocuments("github");
  const headers = token ? { Authorization: `token ${token}` } : {};

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const response = await fetch(url, { headers });
  // const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al cargar ${url}: ${response.status}`);
  }
  return response.json();
}
44;
/**
 * Función recursiva que recorre la ruta especificada y retorna un array
 * de objetos con la siguiente estructura:
 *  - Para carpetas: { type: 'folder', name, path, children: [...] }
 *  - Para archivos Markdown: { type: 'file', name, path, download_url }
 */
async function fetchTree(path = "") {
  const items = await fetchRepoContents(path);
  // Procesamos cada elemento; usamos Promise.all para esperar la resolución de cada llamada recursiva.
  const tree = await Promise.all(
    items.map(async (item) => {
      // Si es directorio, llamar recursivamente para obtener sus hijos.
      if (item.type === "dir") {
        const children = await fetchTree(item.path);
        return {
          type: "folder",
          name: item.name,
          path: item.path,
          children, // array de objetos (vacío si no hay Markdown o subcarpetas relevantes)
        };
      }
      // Solo tomamos archivos que terminen en .md (Markdown)
      if (item.type === "file" && item.name.toLowerCase().endsWith(".md")) {
        return {
          type: "file",
          name: item.name,
          path: item.path,
          download_url: item.download_url,
        };
      }
      return null; // se ignoran otros tipos de archivos
    })
  );
  // Filtramos los elementos nulos y retornamos el array resultante.
  return tree.filter((node) => node !== null);
}

/**
 * Componente React que usa useEffect para cargar el árbol de archivos
 * y lo muestra (en este caso en formato JSON) en pantalla.
 */
const GitHubRepoTree = () => {
  const [tree, setTree] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Inicia la carga desde la raíz (path = '')
    fetchTree("")
      .then((data) => setTree(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!tree) return <div>Cargando...</div>;

  return (
    <div>
      <TreeForceGraph tree={tree} />
    </div>
  );
};

export default GitHubRepoTree;
