import requests
import csv

def fetch_article_ids(query="bloating periods women menstruation", retmax=500):
    """Fetches PubMed article IDs based on a search query."""
    url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term={query}&retmode=json&retmax={retmax}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        data = response.json()
        return data["esearchresult"]["idlist"]
    except requests.exceptions.RequestException as e:
        print(f"Error fetching article IDs for '{query}': {e}")
        return []
    except (KeyError, TypeError) as e:
        print(f"Error parsing article IDs response for '{query}': {e}")
        return []

def fetch_article_details(article_id):
    """Fetches title, authors, and abstract for a given PubMed article ID."""
    base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi"
    fetch_url = f"https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

    try:
        # Fetch summary for title and authors
        summary_url = f"{base_url}?db=pubmed&id={article_id}&retmode=json"
        summary_response = requests.get(summary_url)
        summary_response.raise_for_status()
        summary_data = summary_response.json()
        result = summary_data["result"].get(article_id, {})
        title = result.get("title", "N/A")
        authors = ", ".join([author["name"] for author in result.get("authors", [])]) if "authors" in result else "N/A"

        # Fetch abstract
        abstract_url = f"{fetch_url}?db=pubmed&id={article_id}&retmode=text&rettype=abstract"
        abstract_response = requests.get(abstract_url)
        abstract_response.raise_for_status()
        abstract = abstract_response.text.strip().replace("\n", " ")  # Preprocessing

        return [article_id, title, authors, abstract]

    except requests.exceptions.RequestException as e:
        print(f"Error fetching details for article ID {article_id}: {e}")
        return [article_id, "Error", "Error", "Error fetching abstract"]
    except (KeyError, TypeError) as e:
        print(f"Error parsing details for article ID {article_id}: {e}")
        return [article_id, "Error", "Error", "Error parsing data"]

if __name__ == "__main__":
    symptoms = [
        "bloating",
        "breast tenderness",
        "appetite changes",
        "stress",
        "confused",
        "low energy",
        "self critical",
        "exercise",
        "cramps"
        # Add other symptoms from your tracker here
    ]
    retmax_per_symptom = 500  # You can adjust the number of articles per symptom
    additional_terms = "periods women menstruation"

    for symptom in symptoms:
        query = f"{symptom} {additional_terms}"
        print(f"⏳ Fetching articles for '{query}'...")
        article_ids = fetch_article_ids(query=query, retmax=retmax_per_symptom)
        print(f"   Found {len(article_ids)} articles for '{query}'.")

        if article_ids:
            filename = f"{symptom.replace(' ', '_')}_periods_women.csv"
            with open(filename, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["ID", "Title", "Authors", "Abstract"])  # Headers

                for i, article_id in enumerate(article_ids):
                    print(f"   Fetching details for article {i+1}/{len(article_ids)} (ID: {article_id})...", end='\r')
                    details = fetch_article_details(article_id)
                    writer.writerow(details)
                print(f"\n✅ Successfully saved {len(article_ids)} articles to `{filename}`")
        else:
            print(f"⚠️ No articles found for '{query}'. Skipping CSV creation.")

    print("🎉 Finished fetching and saving articles for all specified symptoms.")