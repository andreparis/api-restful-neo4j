(* ::Package:: *)

path = $CommandLine[[4]];
range = ToExpression[$CommandLine[[5]]];
listaGrafos=Import[path,"Table"];
For[i= 0 ,i < Length[listaGrafos],i++;
	line=listaGrafos[[i]];
	m = Length[line];
	from={};
	to={};
	For[j=1,j<m,j = j + 2,from=Append[from, line[[j]]]; to=Append[to,line[[j+1]]];
	];
	grafo[i]=Graph[Table[from[[k]]<->to[[k]],{k,Length[from]}],VertexLabels->"Name"];
	g=grafo[i];
	adj = AdjacencyMatrix[g];	
	dist = GraphDistanceMatrix[g];
	order = Length[adj];
	
	vertList = VertexList[g];
	numbVertices=VertexCount[g];
	numbEdges = EdgeCount[g];
	edgeDensity=GraphDensity[g];
	averageDistance=MeanGraphDistance[g];
	radius=GraphRadius[g];
	diameter=GraphDiameter[g];
	wienerIndex = 0.5*Total[Total[dist]];
	transmissions = Table[Total[dist[[i]]], {i,1,order}];
	degree = VertexDegree[g];
	(*averageDegree = MeanDegreeConnectivity[g];*)
	vertexConnectivity=VertexConnectivity[g];
	edgeConnectivity=EdgeConnectivity[g];
	betwVertices=BetweennessCentrality[g];
	betwArestas=EdgeBetweennessCentrality[g];
	closenessCentrality = ClosenessCentrality[g];

	Print[i];
	Print["N"];
	Print[numbVertices];
	Print["N"];
	Print[numbEdges];
	Print["N"];
	Print[edgeDensity];
	Print["N"];
	Print[averageDistance];
	Print["N"];
	Print[radius];
	Print["N"];
	Print[diameter];
	Print["N"];
	Print[wienerIndex];
	Print["N"];
	Print[Min[transmissions]];
	Print["N"];
	Print[Max[transmissions]];
	Print["N"];
	(*Print[averageDegree];
	Print["N"];*)
	Print[Min[degree]];
	Print["N"];
	Print[Max[degree]];
	Print["N"];
	Print[vertexConnectivity];
	Print["N"];
	Print[edgeConnectivity];
	Print["N"];
	(*Print[EigenvectorCentrality[g]]; algebric connectivity*)
	Print[Min[betwVertices]];
	Print["N"];
	Print[Max[betwVertices]];
	Print["N"];
	(*Print[minimum_adjusted_vertex_betweenness_centrality];
	Print["N"];
	Print[maximum_adjusted_vertex_betweenness_centrality];
	Print["N"];*)
	Print[Min[betwArestas]];
	Print["N"];
	Print[Max[betwArestas]];
	Print["N"];
	Print[Min[closenessCentrality]];
	Print["N"];
	Print[Max[closenessCentrality]];
	Print["N"];
	Print[betwArestas];
	Print["N"];
	Print[degree];
	Print["N"];
	Print[betwVertices];
	Print["N"];
	Print[closenessCentrality];
	Print["N"];
	Print[transmissions];
	Print["N"];
	Print[vertList];
	Print["N"];
	Print["{"];
	For[l=1, l<Length[vertList], l++,
		Print[VertexEccentricity[g, vertList[[l]]]];
		If[l!=Length[vertList]-1, Print[","],Print["}"]];
	];
	Print["-"];
];
ClearAll["Global`*"];


