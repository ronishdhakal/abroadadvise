import re

def levenshtein_distance(a: str, b: str) -> int:
    """
    Calculate the Levenshtein Distance between two strings.
    This represents the number of single-character edits required
    to change one string into another.
    """
    n, m = len(a), len(b)

    if n == 0:
        return m
    if m == 0:
        return n

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if a[i - 1].lower() == b[j - 1].lower() else 1
            dp[i][j] = min(
                dp[i - 1][j] + 1,       # Deletion
                dp[i][j - 1] + 1,       # Insertion
                dp[i - 1][j - 1] + cost # Substitution
            )

    return dp[n][m]


def levenshtein_distance_phrase(query: str, text: str) -> int:
    """
    Calculate the minimum Levenshtein Distance between the query
    and any word in the target text.
    This helps match short queries against longer phrases or sentences.
    """
    words = re.findall(r'\b\w+\b', text.lower())
    query = query.lower()
    min_dist = float("inf")

    for word in words:
        dist = levenshtein_distance(query, word)
        if dist < min_dist:
            min_dist = dist

    return min_dist
