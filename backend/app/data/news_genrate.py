import json
import random

subjects = [
    "Flooding", "Earthquake", "Wildfire", "Tech breakthrough", "Cyber attack",
    "Political reform", "Economic slowdown", "Startup funding", "Space mission",
    "AI regulation", "Climate summit", "Trade agreement", "Energy crisis",
    "Healthcare innovation", "Transportation strike"
]

actions = [
    "disrupts", "boosts", "threatens", "improves", "delays",
    "accelerates", "impacts", "reshapes", "transforms", "halts"
]

objects = [
    "global supply chains",
    "regional economies",
    "manufacturing sectors",
    "technology markets",
    "financial institutions",
    "international trade routes",
    "renewable energy adoption",
    "digital infrastructure",
    "urban transportation",
    "agriculture production"
]

places = [
    "in China", "in Germany", "in Japan", "in the United States",
    "across Europe", "in Southeast Asia", "in India",
    "in South America", "in the Middle East", "in Africa"
]

news = []

for i in range(1000):
    title = f"{random.choice(subjects)} {random.choice(actions)} {random.choice(objects)} {random.choice(places)}"
    news.append({"title": title})

with open("sample_news.json", "w") as f:
    json.dump(news, f, indent=2)

print("1000 news items generated.")