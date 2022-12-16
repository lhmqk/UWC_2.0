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




constexpr float INF = 1e9;


struct DPData {
    float distance = -1;
    int from = -1;
};

float findOptimalDP(int loc, const uint32_t visited, const int n, std::vector<DPData>& dp, const float dist[]) {
    if (!(visited >> loc & 1) || !(visited & 1)) return INF;

    uint32_t state = loc << n | visited;
    if (dp[state].from >= 0) return dp[state].distance;    

    float minDist = INF;
    int minIdx = -1;
    for (int i = 0; i < n; ++i) {
        if (i == loc) continue;
        float curVal = dist[i * n + loc] + findOptimalDP(i, visited ^ (1u << loc), n, dp, dist);
        if (minDist > curVal) {
            minDist = curVal;
            minIdx = i;
        }
    }
    
    dp[state] = { minDist, minIdx };
    
    return minDist;
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
    // do {
    //     float thisCost = routeCost(route, dist, n);
    //     if (minCost > thisCost) {
    //         minCost = thisCost;
    //         bestRoute = route;
    //     }
    //     sum_cost += thisCost;
    //     ++n_path;
    // } while (std::next_permutation(route.begin() + 1, route.end()));
    std::vector<DPData> dp(n << n);
    for (int i = 1; i < n; ++i) {
        dp[i << n | (1u << i) | 1] = {dist[i], 0};
    }
    float min = INF;
    int minidx = 0;
    for (int i = 1; i < n; ++i) {
        int curval = findOptimalDP(i, (1u << n) - 1, n, dp, dist) + dist[i * n];

        if (min > curval) {
            minidx = i;
            min = curval;
        }
    }
    std::vector<int> path;
    int curPoint = minidx;
    uint32_t state = (1u << n) - 1;
    do {
        int prevPoint = dp[curPoint << n | state].from;
        path.push_back(curPoint);
        state ^= 1u << curPoint;
        curPoint = prevPoint;
    } while (state != 0);
    bestRoute = std::vector(path.rbegin(), path.rend());
    std::ostringstream retStream;

    retStream << min << ',' << sum_cost / n_path << ',' << inorderCost;
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