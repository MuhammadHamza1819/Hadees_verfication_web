"""
CLI Scraper Script for https://www.islamicurdubooks.com/
Usage:
    python scraper_islamicurdubooks.py --book 1 --start 1 --end 10 --output bukhari_sample.json
"""
import sys
import json
import argparse
import asyncio

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

from backend.islamic_urdu_books import fetch_hadith, ISLAMIC_URDU_BOOKS

async def run_scraper(book_id: int, start_no: int, end_no: int, output_file: str):
    book = next((b for b in ISLAMIC_URDU_BOOKS if b["id"] == book_id), None)
    book_name = book["name_ur"] if book else f"Book #{book_id}"

    print(f"\n=======================================================")
    print(f" IslamicUrduBooks.com Scraper (اسلامک اردو بکس اسکریپر) ")
    print(f" Target: {book_name} | Range: {start_no} to {end_no}")
    print(f"=======================================================\n")

    results = []
    for h_no in range(start_no, end_no + 1):
        print(f"-> Fetching Hadith #{h_no}...", end=" ", flush=True)
        try:
            data = await fetch_hadith(book_id, str(h_no))
            results.append(data)
            print("DONE ✓")
        except Exception as e:
            print(f"FAILED ({e})")
        # Gentle rate-limiting
        await asyncio.sleep(0.5)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Saved {len(results)} Hadiths to: {output_file}\n")

def main():
    parser = argparse.ArgumentParser(description="Scrape Hadiths from islamicurdubooks.com")
    parser.add_argument("--book", type=int, default=1, help="Book ID (1: Bukhari, 2: Muslim, 3: Abu Dawud, 4: Ibn Majah, 5: Nasai, 6: Tirmidhi)")
    parser.add_argument("--start", type=int, default=1, help="Starting Hadith number")
    parser.add_argument("--end", type=int, default=5, help="Ending Hadith number")
    parser.add_argument("--output", type=str, default="scraped_hadiths.json", help="Output JSON filename")

    args = parser.parse_args()
    asyncio.run(run_scraper(args.book, args.start, args.end, args.output))

if __name__ == "__main__":
    main()
