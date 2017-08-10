using LightGraphs

function import_edge_list(file)
  graphs = []
  f = open(file, "r")
  for l in eachline(f)
    n = 0
    edges = []
    line = split(l)
    for e in 1:2:(Int64(length(line))-1)
      e1 = parse(line[e]) + 1
      e2 = parse(line[e+1]) + 1
      n = max(n,e1,e2)
      append!(edges, [[e1, e2]])
    end
    g = Graph(n)
    for e in edges
      add_edge!(g,e[1],e[2])
    end
    append!(graphs, [g])
  end
  close(f)
  return graphs
end

function dominating_set(graph)
  n = nv(graph)
  vertices = [i for i in 1:n]
  d_set = [rand(vertices)]

  for i in 1:n
    temp_set = []
    for v in d_set
      temp_set = union(temp_set, neighborhood(graph,v,1))
    end

    compare_set = setdiff(vertices, temp_set)
    if length(compare_set) == 0
      return d_set
    end

    append!(d_set, rand(compare_set))
  end

end

function total_flow_edge(graph, u, v)
digraph = DiGraph(nv(graph))
for e in edges(graph)
  add_edge!(digraph, src(e), dst(e))
  add_edge!(digraph, dst(e), src(e))
end
f, F = maximum_flow(digraph, u, v)
return f
end

function edge_connectivity(graph)
  d_set = dominating_set(graph)
  v = rand(d_set)
  x_set = setdiff(d_set, v)
  total_flows = [total_flow_edge(graph, v, i) for i in x_set]
  return min(minimum(total_flows), minimum(degree(graph)))
end

function total_flow_vertex(graph, u, v)
  digraph = DiGraph(nv(graph))
  n_add = nv(graph)
  vertices = [i for i in 1:nv(graph)]

  for e in edges(graph)
    add_edge!(digraph, src(e), dst(e))
    add_edge!(digraph, dst(e), src(e))
  end

  for w in 1:nv(digraph)
    if (w == u) || (w == v)
      continue
    end
    in_n = [i for i in in_neighbors(digraph, w)]
    out_n = [i for i in out_neighbors(digraph, w)]
    # o ultimo vertice (n) recebe o label do que foi removido
    rem_vertex!(digraph, w)
    add_vertex!(digraph)
    n_add = n_add + 1
    add_vertex!(digraph)
    add_edge!(digraph, n_add - 1, n_add)
    for neighbor in in_n
      if neighbor == n_add - 1
        add_edge!(digraph, w, n_add - 1)
      else
        add_edge!(digraph, neighbor, n_add - 1)
      end
    end
    for neighbor in out_n
      if neighbor == n_add - 1
        add_edge!(digraph, n_add, w)
      else
        add_edge!(digraph, n_add, neighbor)
      end
    end

  end

  f, F = maximum_flow(digraph, u, v)
  return f
end

function vertex_connectivity(graph)
  vertices = [i for i in 1:nv(graph)]
  mindeg = δ(graph)
  v = 0
  for i in 1:length(vertices)
    if vertices[i] == mindeg
      v = i
      break
    end
  end
  x_set = setdiff(vertices, v)
  neigh = neighborhood(graph, v, 1)
  k1 = nv(graph)
  for w in 1:nv(graph)
    if in(w,neigh)
      continue
    end
    k1 = min(k1,total_flow_vertex(graph,v,w))
  end
  neigh = neigh[2:length(neigh)]
  k2 = nv(graph)
  for x in 1:(length(neigh)-1)
    for y in (x+1):length(neigh)
      if in(y, neighborhood(graph, x, 1))
        continue
      end
      k2 = min(k2, total_flow_vertex(graph, x, y))
    end
  end
  return min(k1,k2)
end

function edge_betweenness_centrality(graph)
  n = nv(graph)
  m = ne(graph)
  Q = []
  S = []
  dist = Array{Float64}(n, 1)
  pred = Array{Any}(n, 1)
  sigma = Array{Float64}(n, 1)
  delta = Array{Float64}(n, 1)
  cb = Array{Float64}(m, 1)
  for t in 1:m
    cb[t] = 0
  end
  for s in vertices(graph)
    #single-source shortest path problem
    #initialization
    for w in vertices(graph)
      pred[w] = []
      dist[w] = Inf # = infinity
      sigma[w] = 0
      delta[w] = 0
    end
    dist[s] = 0
    sigma[s] = 1
    prepend!(Q, [s])
    while length(Q) != 0
      v = pop!(Q)
      push!(S, v)
      neighbors = neighborhood(graph, v, 1)
      neighbors = neighbors[2:length(neighbors)]
      for w in neighbors
        #path discovery
        if dist[w] == Inf
          dist[w] = dist[v] + 1
          prepend!(Q, [w])
        end
        #path counting
        if dist[w] == (dist[v] + 1)
          sigma[w] = sigma[w] + sigma[v]
          append!(pred[w], [v])
        end
      end
    end
    #accumulation for edge betweenness
    for v in vertices(graph)
      delta[v] = 0
      while length(S) != 0
        w = pop!(S)
        for v in pred[w]
          c = (sigma[v]/sigma[w])*(1 + delta[w])
          index = 1
          for e in edges(graph)
            if ((src(e) == v) && (dst(e) == w)) || ((src(e) == w) && (dst(e) == v))
              break
            end
            index = index + 1
          end
          cb[index] = cb[index] + c
          delta[v] = delta[v] + c
        end
        #if w != s
        #  cb[w] = cb[w] + delta[w]
        #end
      end
    end
    # #accumulation for vertex betweenness
    # for v in vertices(graph)
    #   delta[v] = 0
    #   while length(S) != 0
    #     w = pop!(S)
    #     for v in pred[w]
    #       delta[v] = delta[v] + (sigma[v]/sigma[w])*(1 + delta[w])
    #     end
    #     if w != s
    #       cb[w] = cb[w] + delta[w]
    #     end
    #   end
    # end
  end
  return cb
end

function print_property(list)
  out_string = "{"
  for i in 1:length(list)
    out_string = string(out_string, list[i])
    if i == length(list)
      out_string = string(out_string, "}")
    else
      out_string = string(out_string, ",")
    end
  end
  return out_string
end

###### INICIO DO SCRIPT ######

#path = ARGS[4]
#start_point = ARGS[5]
#end_point = ARGS[6]

graphs = import_edge_list(ARGS[1])
start_point = parse(Int64,ARGS[2]) + 1
end_point = parse(Int64,ARGS[3])

graph_index = 0
output_string = ""
for g in min(length(graphs),start_point):min(length(graphs),end_point)
  n = nv(graphs[g])
  m = ne(graphs[g])
  density = 2*m/(n*(n-1))
  dist_mx = floyd_warshall_shortest_paths(graphs[g]).dists
  wiener = sum(dist_mx)/2
  avg_dist = wiener/(n*(n-1))
  rad = radius(graphs[g])
  diam = diameter(graphs[g])
  transmissions = sum(dist_mx,1)
  adj = adjacency_matrix(graphs[g])
  degrees = degree(graphs[g])
  betweenness_vertices = betweenness_centrality(graphs[g], normalize=false)
  betweenness_edges = edge_betweenness_centrality(graphs[g])
  closeness = closeness_centrality(graphs[g])
  eccentricities = [eccentricity(graphs[g], i) for i in vertices(graphs[g])]

output_string = string(output_string, graph_index, "N", n, "N", m, "N", density, "N", avg_dist, "N", rad, "N", diam, "N", wiener, "N",  minimum(transmissions), "N", maximum(transmissions), "N", minimum(degrees), "N", maximum(degrees), "N", vertex_connectivity(graphs[g]), "N", edge_connectivity(graphs[g]), "N", minimum(betweenness_vertices), "N", maximum(betweenness_vertices), "N", minimum(betweenness_edges), "N", maximum(betweenness_edges), "N", minimum(closeness), "N", maximum(closeness), "N", print_property(betweenness_edges), "N", print_property(degrees), "N", print_property(betweenness_vertices), "N", print_property(closeness), "N", print_property(transmissions), "N", print_property([v-1 for v in vertices(graphs[g])]), "N", print_property(eccentricities), "-"  )

graph_index = graph_index + 1
end
println(output_string)
