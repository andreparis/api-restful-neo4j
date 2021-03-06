(* ::Package:: *)

BeginPackage["GraphsMMR`"]

CalculoDadosGrafo::usage =
		"CalculoDadosGrafo[grafo_, RWApath_] retorna os valores de {vertices, arestas, 
 dist_de _grau, espectro_adj, espectro_lapl, espectro_dist, wiener, diametro, comprimentos_de _onda, singulares_adj, singulares_lapl, \
singulares_dist, dist_media, betweenness_de_aresta, conectividade_natural, coeficiente_de_clustering_global, centralidade_de_autovetor,
centralidade_closeness, angulo_medio_de_comunicabilidade, espectro_comunicabilidade, transmiss\[OTilde]es. }"

CalculoDadosCompleto::usage =
		"CalculoDadosCompleto[arquivog6_, RWApath_, arquivoDestino_] importa os grafos do arquivo g6 e calcula os dados especificados em CalculoDadosGrafo, exportando para um .csv ."

ImportarDados::usage = 
    "ImportarDados[arquivoFonte_]"

DegreeDistribution::usage = 
		"DegreeDistribution[graph] returns the point for plotting the degree distribution of a graph."

NaturalConnectivity::usage =
		"NaturalConnectivity[graph_] returns the natural connectivity (or eigenvalue) of a graph."

CommunicabillityMatrix::usage = 
		"CommunicabillityMatrix[graph_] returns the communicabillity matrix (e^A) of a graph."

CommunicabillityDistancesMatrix::usage =
		"CommunicabillityDistancesMatrix[graph_] returns the matrix where the i-j entry is the commun. distance between nodes i and j."

CommunicabillityAnglesMatrix::usage = 
		"CommunicabillityAnglesMatrix[graph_] returns the matrix where the i-j entry is the commun. angle between nodes i and j."

AverageCommunicabillityAngle::usage =
 		" AverageCommunicabillityAngle[graph_] returns the average communicability angle of the graph."

PsiNorma::usage =
		"PsiNorma[M_, p_, q_] returns the PsiNorm (sum of SPR^(1/P - 1/Q), where P = 1 + p and Q = 1 + q of a matrix M, where 1/p + 1/q = 1"

FindInducedSubgraph::usage =
		"FindInducedSubgraph[graph1, graph2] find a induced subgraph isomorph to graph2 as a subgraph of graph1. Returns False otherwise."

TwinRecursiveGenerate::usage =
        "TwinRecursiveGenerate[twinGraph] generates all the twin graphs that can be generated by the 
	classic algorithm, not eliminating the isomorphisms."

TwinMergingGenerate::usage = 
		"TwinMergingGenerate[twinGraph1, twinGraph2] generates all twin graphs that can be generated by the merging 
	algorithm, not eliminating the isomorphisms."

NautyShortG::usage =
        "NautyShortG[graphList, nautyPath] takes a list of graphs and calls the shortg function from nauty tools and eliminates 
	the isomorphisms."

RotinaRapidaGeracaoGemeos::usage = 
		"RotinaRapidaGeracaoGemeos[nautyPath, nodeNumber]. Rotina que elimina alguns passos intermedi\[AAcute]rios para otimizar a 
	gera\[CCedilla]\[ATilde]o dos twins no cluster. Ela espera um arquivo de nome 'twinsA.g6', onde A \[EAcute] o numero de n\[OAcute]s inicial para gera\[CCedilla]\[ATilde]o, ou seja,
	o n\[UAcute]mero de n\[OAcute]s dos grafos que voc\[EHat] J\[CapitalAAcute] POSSUI. O valor de A tamb\[EAcute]m deve ser passado. As funcionalidades de TwinRecursiveGenerate e 
	NautyShortG est\[ATilde]o implementadas nelas sem a necessidade de chamada de subrotinas para essas fun\[CCedilla]\[OTilde]es e de opera\[CCedilla]\[OTilde]es de atribui\[CCedilla]\[ATilde]o 
	desnecess\[AAcute]rias."

WienerIndex::usage = 
		"WienerIndex[graph] calculates de Wiener Index (sum of all distances between every pair of nodes) of a graph."

VertexResidualMeanDistance::usage =
		"VertexResidualMeanDistance[graph] calculares the vertex residual mean (or average) distance of a graph."

EdgeResidualMeanDistance::usage =
		"VertexResidualMeanDistance[graph] calculares the residual mean (or average) distance of a graph."

ExportEdgeList::usage =
		"ExportEdgeList[graph, fileName] exports the given graph to a .txt file with the given name."

ImportEdgeList::usage =
		"ImportEdgeList[fileName] imports a graph from a file with a list of edges."

CalculateConflictGraph::usage =
        "CalculateConflictGraph[foldersDir, fileName] generates the conflict graph from the files generated by the RWA."

NumberOfWavelengths::usage =
		"NumberOfWavelengths[RWApath_, graph_] returns the number of wavelengths required by the graph."

ConflictGraphRWA::usage =
		"ConflictGraphRWA[RWApath, graph] integrates the RWA functionality with the conflict graph calculation."

ConflictSelectedPaths::usage =
		"ConflictSelectedPaths[RWApath_, graph_] returns the list  of the selected paths of the graph."

Begin["`Private`"]

CalculoDadosGrafo[grafo_, RWApath_] := (
  adj = AdjacencyMatrix[grafo];
  adjSpect = Sort[N[Eigenvalues[adj]], Greater];
  lapl = KirchhoffMatrix[grafo];
  dist = GraphDistanceMatrix[grafo];
  commun = CommunicabillityMatrix[graph];
  order = Length[m];

  natcon = 0;
  For[i = 1, i <= order, i++,
		natcon = natcon + Exp[adjSpect[[i]]];
		];
  natcon = Log[(1/order)*natcon];

	angles = {};
	For[i = 1, i < order, i++,
  	For[j = i + 1, j <= order, j++,
    	dist = Sqrt[m[[i]][[i]] + m[[j]][[j]] - 2*m[[i]][[j]]];
    	angles = Append[angles, (180/Pi)*(m[[i]][[i]] + m[[j]][[j]] - dist^2)/(2*
          Sqrt[m[[i]][[i]]*m[[j]][[j]]])];
    ];
  ];

  transmissions = Table[Total[dist[[i]]], {i,1,order}]

  dados = {VertexCount[grafo], EdgeCount[grafo], 
    Sort[VertexDegree[grafo], Greater][[1]], 
    Sort[VertexDegree[grafo], Less][[1]], 
    adjSpect, 
    Sort[N[Eigenvalues[lapl]], Greater], 
    Sort[N[Eigenvalues[dist]], Greater], 
    0.5*Total[Total[dist]], 
    GraphDiameter[grafo], 
    NumberOfWavelengths[RWApath, grafo], 
    N[SingularValueList[adj]], 
    N[SingularValueList[lapl]], 
    N[SingularValueList[dist]], 
    N[MeanGraphDistance[grafo]],
	EdgeBetweennessCentrality[grafo], 
	natcon,
	GlobalClusteringCoefficient[grafo],
	EigenvectorCentrality[grafo],
	ClosenessCentrality[grafo],
	Mean[angles],
	Sort[N[Eigenvalues[commun], Greater]],
	transmissions
	}
  )

CalculoDadosCompleto[arquivog6_, RWApath_, arquivoDestino_] := (
  graphs = Import[arquivog6, "Graph6", VertexLabels -> "Name"];
  dados = {};
  dir = Directory[];
  For[i = 1, i <= Length[graphs], i++, 
   dados = Append[dados, CalculoDadosGrafo[graphs[[i]], RWApath]];];
  SetDirectory[dir];
  Export[arquivoDestino <> ".csv", dados];
  dados
)

ImportarDados[arquivoFonte_] := (
  listaTemp = Import[arquivoFonte];
  listaDados = {};
  For[i = 1, i <= Length[listaTemp], i++,
    listaDados = Append[listaDados, ToExpression[listaTemp[[i]]]];
    ];
  listaDados
  )

DegreeDistribution[graph_] := (
  degreeList = Tally[VertexDegree[graph]];
  total = Length[VertexDegree[graph]];
  pointList = 
   Table[{degreeList[[i]][[1]], degreeList[[i]][[2]]/total}, {i, 1, 
     Length[degreeList]}]
  )

NaturalConnectivity[graph_] := (
	n = VertexCount[graph];
	eigens = Eigenvalues[AdjacencyMatrix[graph]];
	sum = 0;
	For[i = 1, i <= n, i++,
		sum = sum + Exp[eigens[[i]]];
		];
	sum = Log[(1/n)*sum]
	)

CommunicabillityMatrix[graph_] := N[MatrixExp[AdjacencyMatrix[graph]]]

CommunicabillityDistancesMatrix[graph_] := (
  m = N[MatrixExp[AdjacencyMatrix[graph]]];
  order = Length[m];
  distances = ConstantArray[0, {order, order}];
  For[i = 1, i <= order, i++,
   For[j = i, j <= order, j++,
     distances[[i]][[j]] = 
      Sqrt[m[[i]][[i]] + m[[j]][[j]] - 2*m[[i]][[j]] ];
     distances[[j]][[i]] = distances[[i]][[j]];
     ];
   ];
  distances
  )

  CommunicabillityAnglesMatrix[graph_] := (
  m = N[MatrixExp[AdjacencyMatrix[graph]]];
  order = Length[m];
  angles = ConstantArray[0, {order, order}];
  For[i = 1, i <= order, i++,
   For[j = i, j <= order, j++,
     dist = Sqrt[m[[i]][[i]] + m[[j]][[j]] - 2*m[[i]][[j]]];
     angles[[i]][[j]] = (180/
         Pi)*(m[[i]][[i]] + m[[j]][[j]] - dist^2)/(2*
          Sqrt[m[[i]][[i]]*m[[j]][[j]]]);
     angles[[j]][[i]] = angles[[i]][[j]]];
   ];
  angles
  )

  AverageCommunicabillityAngle[graph_] := (
  m = N[MatrixExp[AdjacencyMatrix[graph]]];
  order = Length[m];
  angles = {};
  For[i = 1, i < order, i++,
   For[j = i + 1, j <= order, j++,
     dist = Sqrt[m[[i]][[i]] + m[[j]][[j]] - 2*m[[i]][[j]]];
     angles = 
      Append[angles, (180/
          Pi)*(m[[i]][[i]] + m[[j]][[j]] - dist^2)/(2*
           Sqrt[m[[i]][[i]]*m[[j]][[j]]])];
     ];
   ];
  Mean[angles]
  )

  PsiNorma[M_, p_, q_] := (
  r = 0;
  soma = 0;
  spr = Sort[Eigenvalues[M], Greater][[1]];
  n = Length[M];
  For[j = 1, j < n + 1, j++,
   If[(Part[q, j] != 0) && (Part[p, j] != 0),
    P = 1 + (Part[p, j]/Part[q, j]);
    Q = 1 + (Part[q, j]/Part[p, j]);
    r = (1/P) - (1/Q);
    ];
   soma = soma + spr*n^r;
   ];
  soma
  )

FindInducedSubgraph[graph1_, graph2_] := (
  vertex1 = VertexCount[graph1];
  vertex2 = VertexCount[graph2];
  
  vertexSubsets = Subsets[VertexList[graph1], {vertex2}];
  
  found = False;
  subset = 0;
  For[i = 1, i <= Length[vertexSubsets], i++,
   If[IsomorphicGraphQ[Subgraph[graph1, {vertexSubsets[[i]]}], graph2],
     found = True;
     subset = i;
     ];
   ];
  If[found,
   highlighted = 
    HighlightGraph[graph1, 
     Subgraph[graph1, vertexSubsets[[subset]]]];
   Return[highlighted];,
   Return[found];
   ];
  )

TwinRecursiveGenerate[twinGraph_] := (

(* List of graphs generated by the twinGraph *)
gList = {};

vertexNum = VertexCount[twinGraph];

(* Nested for loops that verify every pair of vertices *)
For[i = 1, i < vertexNum, i++,
	For[j = i + 1, j < vertexNum+ 1, j++,
		If[GraphDistance[twinGraph, i, j] == 2,
		(* Gets the neighborhoods of the pair *)
		neighbor1 = VertexDelete[NeighborhoodGraph[twinGraph,i], i];
		neighbor2 = VertexDelete[NeighborhoodGraph[twinGraph, j], j];

		(* Compares the neighborhoods and adds the new node and edges if they are equal *)
		If[neighbor1 == neighbor2,
			gList = Prepend[gList, EdgeAdd[ VertexAdd[twinGraph, vertexNum + 1], {UndirectedEdge[i, vertexNum + 1], UndirectedEdge[j, vertexNum + 1]}]];
		];
		];
	];
];

(* Returns the list *)
gList
)


NautyShortG[graphList_, nautyPath_] := (

(* Stores the actual directory *)
dir = Directory[];

(* Sets the directory to your nauty folder *)
SetDirectory[nautyPath];

(* Saves the graphList as a file in the .g6 format *)
Export["tempNautyShortGFile.g6", graphList, "Graph6"];

Run["./shortg","tempNautyShortGFile.g6"];

(* Imports the graphs without the isomorphisms *)
newGraphList = Import["tempNautyShortGFile.g6","Graph6", VertexLabels -> "Name"];

(* Returns to the previous directory *)
SetDirectory[dir];

newGraphList

)


TwinMergingGenerate[twinGraph1_, twinGraph2_] := (

(* List of graphs generated by the twin graphs *)
gList = {};

vertexNum = {VertexCount[twinGraph1], VertexCount[twinGraph2]};

(* Nested for loops that verify every pair of vertices *)
For[i = 1, i < vertexNum[[1]], i++,
	For[j = i + 1, j < vertexNum[[1]] + 1, j++,

		(* Gets the neighborhoods of the pair *)
		neighbor11 = VertexDelete[NeighborhoodGraph[twinGraph1, i], i];
		neighbor12 = VertexDelete[NeighborhoodGraph[twinGraph1, j], j];

		(* Compares the neighborhoods and merge the graphs if they are equal *)
		If[neighbor11 == neighbor12,
			For[k = 1, k < vertexNum[[2]], k++,
				For[l = k + 1, l < vertexNum[[2]] + 1, l++,

					(* Gets the neighborhoods of the pair *)
					neighbor21 = VertexDelete[NeighborhoodGraph[twinGraph2, k], k];
					neighbor22 = VertexDelete[NeighborhoodGraph[twinGraph2, l], l];

					If[neighbor21 == neighbor22,

						union = GraphDisjointUnion[twinGraph1, twinGraph2];

						gList = Prepend[gList, CanonicalGraph[EdgeAdd[ union, 
							{UndirectedEdge[i + vertexNum[[1]], k], UndirectedEdge[i + vertexNum[[1]], l], 
								UndirectedEdge[j + vertexNum[[1]], k], UndirectedEdge[j + vertexNum[[1]], l]}]]];
					]

				];
			];
		]
	];
];
(* Returns the list *)
gList
)

RotinaRapidaGeracaoGemeos[nautyPath_, nodeNumber_] := (

previousDirectory = Directory[];

SetDirectory[nautyPath];

graphList = Import["twins"<>IntegerString[nodeNumber]<>".g6", VertexLabels -> "Name" ];
graphNumber = Length[graphList];

graphBigList = {};

For[n = 1, n <= graphNumber, n++,

twinGraph = graphList[[n]];

(* List of graphs generated by the twinGraph *)
gList = {};

vertexNum = VertexCount[twinGraph];

(* Nested for loops that verify every pair of vertices *)
For[i = 1, i < vertexNum, i++,
	For[j = i + 1, j < vertexNum+ 1, j++,
		If[GraphDistance[twinGraph, i, j] == 2,
		(* Gets the neighborhoods of the pair *)
		neighbor1 = VertexDelete[NeighborhoodGraph[twinGraph,i], i];
		neighbor2 = VertexDelete[NeighborhoodGraph[twinGraph, j], j];

		(* Compares the neighborhoods and adds the new node and edges if they are equal *)
		If[neighbor1 == neighbor2,
			gList = Prepend[gList, EdgeAdd[ VertexAdd[twinGraph, vertexNum + 1], {UndirectedEdge[i, vertexNum + 1], UndirectedEdge[j, vertexNum + 1]}]];
		];
		];
	];
];

(* Unites the big list *)
graphBigList = Union[graphBigList, gList];

];

(* Sets the directory to your nauty folder *)
SetDirectory[nautyPath];

(* Saves the graphList as a file in the .g6 format *)
Export["twins"<>IntegerString[nodeNumber+1]<>".g6", graphBigList];

Run["./shortg","twins"<>IntegerString[nodeNumber+1]<>".g6"];

(* Returns to the previous directory *)
SetDirectory[previousDirectory];

)

WienerIndex[graph_] := (

  matrix = GraphDistanceMatrix[graph];
  0.5*Total[Total[matrix]]

  )

VertexResidualMeanDistance[g_] := (

   vertexRMDs = {};
   vertexCount = VertexCount[g];
   vertexRMDs = 
    Table[{MeanDistance[ CanonicalGraph[VertexDelete[g, i ] ]] }, {i, 
      vertexCount}];
   (Mean[vertexRMDs] - MeanDistance[g] )[[1]]

   );

EdgeResidualMeanDistance[g_] := (

   edgeRMDs = {};
   edgeList = EdgeList[g];
   edgeCount = Length[edgeList];
   edgeRMDs = 
    Table[{ MeanDistance[ 
       CanonicalGraph[EdgeDelete[g, edgeList[[i]]] ]]}, {i, 1, 
      edgeCount}];
    (Mean[edgeRMDs] - MeanDistance[g])[[1]]

   );

ExportEdgeList[graph_, fileName_] := (
edgeList = EdgeList[graph];
toExport = {};
len = Length[edgeList];
fullString = "";
For[i = 1, i <= len, i++,
 fullString = 
   fullString <> ToString[edgeList[[i]][[1]]] <> " " <> 
    ToString[edgeList[[i]][[2]]] <> "\n";
 ];
Export[fileName <> ".txt", fullString];
  )

  ImportEdgeList[fileName_] := (
  edgeList = Import[fileName, "Data"];
  Graph[edgeList]
  )

CalculateConflictGraph[foldersDir_, fileName_]:=(
allPathsDir = foldersDir<>"/allPaths/"<>fileName;
selectedPathsDir =foldersDir<> "/selectedPaths/"<>fileName;
allPaths = Import[allPathsDir, "Data"];
selectedPaths = Import[selectedPathsDir, "Data"];

list = {};
For[i = 1, i <= Length[selectedPaths], i++,
	list = Append[list, allPaths[[selectedPaths[[i]][[1]]+1]]];
];
For[i = 1, i <= Length[list], i++,
	list[[i]] = StringSplit[list[[i]]];
];
For[i = 1, i <= Length[list], i++,
	For[j = 1, j <= Length[list[[i]]], j++,
		list[[i]][[j]] = ToExpression[list[[i]][[j]]] - 1;
	];
];

(*Transforms every path,previously as a list of vertices,in a list of edges.*)
listFormatted={};
For[i=1,i<Length[list]+1,i++,
	edges={};
	For[j=1,j<Length[Part[list,i]],j++,
		edges=Append[edges,{Min[{Part[Part[list,i],j],Part[Part[list,i],j+1]}],Max[{Part[Part[list,i],j],Part[Part[list,i],j+1]}]}];
	];
listFormatted=Append[listFormatted,edges];];

(*Creates a final list of edges (that will make the graph) based on edge intersections*)n=Length[listFormatted];
graph={};
For[i=1,i<n,i++,
	For[j=i+1,j<n+1,j++,
		If[Length[Intersection[Part[listFormatted,i],Part[listFormatted,j]]]>=1,
			graph=Append[graph,(Part[listFormatted,i]<->Part[listFormatted,j])];
			];
		];
	];
(*Constructs the graph based on the edges generated previously*)
Graph[graph,VertexLabels->"Name"]
)

ConflictSelectedPaths[RWApath_, graph_] := (

(*Sets the directory to your RWA folder*)
SetDirectory[RWApath];

(*Saves the graphList as a file in the txt format*)
ExportEdgeList[graph, "graphEdgeListTempFile"];
Run["./RWA", "graphEdgeListTempFile"<>".txt"];
CalculateConflictGraph[RWApath, "graphEdgeListTempFile"<>".txt"];
allPathsDir = RWApath<>"allPaths/"<>"graphEdgeListTempFile"<>".txt";
selectedPathsDir =RWApath<> "selectedPaths/"<>"graphEdgeListTempFile"<>".txt";
allPaths = Import[allPathsDir, "Data"];
selectedPaths = Import[selectedPathsDir, "Data"];

list = {};
For[i = 1, i <= Length[selectedPaths], i++,
	list = Append[list, allPaths[[selectedPaths[[i]][[1]]+1]]];
];
For[i = 1, i <= Length[list], i++,
	list[[i]] = StringSplit[list[[i]]];
];
For[i = 1, i <= Length[list], i++,
	For[j = 1, j <= Length[list[[i]]], j++,
		list[[i]][[j]] = ToExpression[list[[i]][[j]]] - 1;
	];
];

highlightedPaths = {};
For[i = 1, i <= Length[list], i++,
	highlightedPaths = Append[highlightedPaths, HighlightGraph[graph, PathGraph[list[[i]]], VertexLabels -> "Name"]];
];

Column[highlightedPaths]
	)


NumberOfWavelengths[RWApath_, graph_] := (

(*Sets the directory to your RWA folder*)
SetDirectory[RWApath];

(*Saves the graphList as a file in the txt format*)
ExportEdgeList[graph, "graphEdgeListTempFile"];
Run["./RWA", "graphEdgeListTempFile"<>".txt", ">>", "outTemp.txt"];

number = Import["outTemp.txt"];
Run["rm", "outTemp.txt"];

ToExpression[StringSplit[number][[2]]]

	)

ConflictGraphRWA[RWApath_, graph_] := (

(*Sets the directory to your RWA folder*)
SetDirectory[RWApath];

(*Saves the graphList as a file in the txt format*)
ExportEdgeList[graph, "graphEdgeListTempFile"];
Run["./RWA", "graphEdgeListTempFile"<>".txt"];
CalculateConflictGraph[RWApath, "graphEdgeListTempFile"<>".txt"]

)

(*
WorstCaseConflictGraph[g_] := (
(* For each pair of vertices, calculates the paths between them *)
listTemp = {};
For[i = 1, i <VertexCount[g], i++,
	For[j =  i + 1, j < VertexCount[g]+1, j++,
		listTemp = Append[listTemp, FindVertexIndependentPaths[g, i, j, 1000000]];
	];
];
(* Eliminates the longest paths, remaining only the shortest ones *)
listFinal = {};
pairs = VertexCount[g]*(VertexCount[g] - 1)/2;
For[i = 1, i < pairs + 1, i++,
	len = Length[Part[Part[listTemp, i], 1]];
	pair = Part[listTemp, i];
	For[j =  1, j < Length[pair]+1, j++,
		candidate = Part[pair, j];
		If[Length[candidate] == len,
			listFinal = Append[listFinal, candidate];
		];
	];
];
(* Transforms every path, previously as a list of vertices, in a list of edges. *)
listFormatted = {};
For[i = 1, i < Length[listFinal] + 1, i++,
	edges = {};
	For[j = 1, j < Length[Part[listFinal, i]], j++,
		edges = Append[edges, {Min[{Part[Part[listFinal, i], j], Part[Part[listFinal, i], j+1]}], Max[{Part[Part[listFinal, i], j], Part[Part[listFinal, i], j+1]}]}];
	];
	listFormatted = Append[listFormatted, edges];
];
(* Creates a final list of edges (that will make the graph) based on edge intersections *)
n = Length[listFormatted];
graph ={};
For[i = 1, i < n, i++,
	For[j = i + 1, j < n +1, j++,
		If[Length[Intersection[Part[listFormatted, i], Part[listFormatted, j]]]>=1,
			graph = Append[graph, (Part[listFormatted, i] <-> Part[listFormatted, j])];
		];
	];
];
(* Constructs the graph based on the edges generated previously *)
Graph[graph, VertexLabels->"Name"]
)*)

(*IntersectPaths[conflictGraph1_, conflictGraph2_] := (
graphIntersection = GraphIntersection[conflictGraph1, conflictGraph2];
listFormatted = {};
degrees = VertexDegree[graphIntersection];
vertices = VertexList[graphIntersection];
For[i = 1, i < VertexCount[graphIntersection] + 1, i++,
	If[degrees[[i]] == 0,
		listFormatted = Append[listFormatted, vertices[[i]] ];
	];
];

(* Creates a final list of edges (that will make the graph) based on edge intersections *)
n = Length[listFormatted];
graph ={};
For[i = 1, i < n, i++,
	For[j = i + 1, j < n +1, j++,
		If[Length[Intersection[Part[listFormatted, i], Part[listFormatted, j]]]>=1,
			graph = Append[graph, (Part[listFormatted, i] <-> Part[listFormatted, j])];
		];
	];
];
(* Constructs the graph based on the edges generated previously *)
Graph[graph, VertexLabels->"Name"]
)*)



End[ ]

EndPackage[ ]

