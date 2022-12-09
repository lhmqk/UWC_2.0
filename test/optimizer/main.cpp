#include <napi.h>
#include <sstream>
#include <algorithm>

float routeCost(std::vector<int> const& route, float const* dist, int n) {
    float cost = 0;
    for (int i = 1; i < n; ++i) {
        cost += dist[route[i - 1] * n + route[i]];
    }
    return cost + dist[route.back() * n + route[0]];
}


Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  auto dist_matrix = info[0].As<Napi::Float32Array>();
  int n = info[1].As<Napi::Number>().Int32Value();

  float const* dist = dist_matrix.Data();

 std::vector<int> route;
    for (int i = 0; i < n; ++i) route.push_back(i);
    float minCost = 1e9;
    float inorderCost = routeCost(route, dist, n);    
    std::vector<int> bestRoute = route;

    uint64_t n_path = 0;
    double sum_cost = 0;
    do {
        float thisCost = routeCost(route, dist, n);
        if (minCost > thisCost) {
            minCost = thisCost;
            bestRoute = route;
        }
        sum_cost += thisCost;
        ++n_path;
    } while (std::next_permutation(route.begin() + 1, route.end()));
    std::ostringstream retStream;

    retStream << minCost << ',' << sum_cost / n_path << ',' << inorderCost;
    static char buffer[1 << 16];

    for (int v : bestRoute) {
        retStream << ',' << v;
    }
  return Napi::String::New(env, retStream.str());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "shortestRoute"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(nativeAddon, Init)