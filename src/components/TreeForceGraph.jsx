import { useMemo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebaseConfig";

async function readDocuments(collectionName) {
  const id = "sR1pzBxCcGmaPZhFKzrp";
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().token;
  } else {
    return false;
  }
}
/**
 * Función para transformar el arreglo "tree" (que contiene nodos de tipo
 * { type, name, path, children } para carpetas y { type, name, path, download_url } para archivos)
 * en un objeto con la estructura { nodes: [...], links: [...] } que espera react-force-graph.
 */
function convertTreeToGraph(tree) {
  const nodes = [];
  const links = [];

  // Función recursiva que recorre cada nodo del árbol.
  function traverse(node, parent = null) {
    // Usamos "path" como id único.
    nodes.push({
      id: node.path,
      name: node.name,
      type: node.type,
    });
    // Si hay un nodo padre, creamos un enlace (link) entre padre e hijo.
    if (parent) {
      links.push({
        source: parent.path,
        target: node.path,
      });
    }
    // Si el nodo es una carpeta y tiene hijos, recorrerlos.
    if (node.type === "folder" && node.children && node.children.length > 0) {
      node.children.forEach((child) => traverse(child, node));
    }
  }

  // Recorremos todos los nodos de nivel superior.
  tree.forEach((topNode) => traverse(topNode));
  return { nodes, links };
}

/**
 * Componente TreeForceGraph
 * - Recibe por prop "tree" (el árbol de nodos).
 * - Usa useMemo para transformar el árbol solo cuando cambia.
 * - Renderiza un gráfico de fuerza en 2D con nodos coloreados según su "type" (p. ej., 'folder' o 'file'),
 *   y muestra una etiqueta (nodeLabel) con el nombre y el tipo.
 */
const TreeForceGraph = ({ tree }) => {
  // Convertir el "tree" a datos de gráfico (graphData)
  const graphData = useMemo(() => convertTreeToGraph(tree), [tree]);
  const [selectedContent, setSelectedContent] = useState("");

  // Reemplaza estos valores con los de tu repositorio y tu token (lo ideal es no dejar el token en el código fuente)
  const owner = "dardocam";
  const repo = "tecpro-planning";
  let filePath = ""; //node.id
  const branch = "main";
  const token = async () => await readDocuments("github");
  const headers = token ? { Authorization: `token ${token}` } : {};
  // Al hacer clic en un nodo se muestra el contenido Markdown correspondiente
  const handleNodeClick = async (node) => {
    if (node.type === "file" && node.name.toLowerCase().endsWith(".md")) {
      // Construimos la URL de la API para obtener el contenido del archivo
      filePath = node.id;
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

      // Realizamos la solicitud pasando los encabezados "Authorization" y "Accept"
      fetch(url, headers)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then((data) => {
          setSelectedContent(data);
        })
        .catch((err) => {
          console.error("Error fetching file:", err);
          // setError(err.message);
        });
    }
  };
  return (
    <div>
      <h2>Visualización del Árbol del Repositorio</h2>
      <ForceGraph2D
        graphData={graphData}
        // Se asigna un color automático según el tipo (folder o file)
        nodeAutoColorBy={(node) =>
          node.name === "TECPRO" ? node.color : node.type
        }
        // Se muestra el nombre y el tipo como etiqueta cuando se pasa el mouse sobre un nodo
        nodeLabel={(node) => `${node.name} (${node.type})`}
        // Parámetros para mostrar flechas en los enlaces (opcional)
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        // width={1}
        height={600}
        onNodeClick={handleNodeClick}
        // Personalizamos la representación de cada nodo: dibujamos un círculo y el título
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 1 * globalScale;
          ctx.font = `${fontSize}px Arial`;
          // Dibuja el círculo (nodo animado por la simulación)
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || "orange";
          ctx.fill();
          // Dibuja el título dentro del círculo
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, node.x, node.y);
        }}
        nodeCanvasObjectMode={() => "replace"}
      />
      <div style={{ textAlign: "left" }}>
        {" "}
        {selectedContent ? (
          <ReactMarkdown>{selectedContent}</ReactMarkdown>
        ) : (
          <p>Haz clic en un nodo para ver su contenido.</p>
        )}
      </div>
    </div>
  );
};

export default TreeForceGraph;

TreeForceGraph.propTypes = {
  tree: PropTypes.array,
};
