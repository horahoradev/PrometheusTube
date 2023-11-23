package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
)

const (
	baseURL    = "http://localhost:9000/api"
	sm9TestTag = "今年レンコンコマンダー常盤"
)

func main() {
	//makeArchiveRequest(client, "bilibili", "tag", "sm35952346")
	//makeArchiveRequest(client, "bilibili", "channel", "1963331522")

	var client *http.Client
	var err error

	for start := time.Now(); time.Since(start) < time.Minute*5; time.Sleep(time.Second * 30) {
		client, err = authenticate("admin", "admin")
		if err != nil {
			log.Errorf("Failed to login. Err: %s", err)
			continue
		}

		urls := []string{
			"https://www.youtube.com/watch?v=FrIiEuNPE38",
			"https://www.youtube.com/watch?v=uwYyevRg1Ck",
			"https://www.youtube.com/watch?v=SwPqaG9eYNY",
			"https://www.youtube.com/watch?v=JzrxzyywS7Q",
			"https://www.youtube.com/watch?v=yVSCXs9VjK4",
			"https://www.youtube.com/watch?v=1dGSbmptjw8",
			"https://www.youtube.com/watch?v=UZ4RP14aOJY",
			"https://www.youtube.com/watch?v=1jVzaGb8PV4",
			"https://www.youtube.com/watch?v=xRZ6SfwzLBA",
			"https://www.youtube.com/watch?v=ziJLg8UJK7k",
			"https://www.youtube.com/watch?v=5eFOdOadzP4",
			"https://www.youtube.com/watch?v=BxfurKE41Ng",
			"https://www.youtube.com/watch?v=U6RtFpM5cho",
			"https://www.youtube.com/watch?v=bybssu7ZIS0",
			"https://www.youtube.com/watch?v=WFfZ-VlZfvg",
			"https://www.youtube.com/watch?v=jJhm9iDR9HA",
			"https://www.youtube.com/watch?v=ZpyueT99038",
			"https://www.youtube.com/watch?v=QZmxqSCYEpE",
			"https://www.youtube.com/watch?v=9PUmuffh5Lo",
			"https://www.youtube.com/watch?v=c8_Ctg_VvD0",
			"https://www.youtube.com/watch?v=KbcLg_kMDf8",
			"https://www.youtube.com/watch?v=4vJ5-LSb-_k",
			"https://www.youtube.com/@subeteanatanoseidesu",
			"https://www.youtube.com/watch?v=FnH1f7sCAHg",
			"https://www.youtube.com/watch?v=Md3xdiX91Us",
			"https://www.youtube.com/watch?v=BTLhF8rFJ04",
		}
		for _, url := range urls {
			err := makeArchiveRequest(client, url)
			if err != nil {
				log.Errorf("Failed to make archival request. Err: %s", err)
				// goto authloop
			}
		}
		break
	}

	log.Info("Authenticated and made archival requests")

	for start := time.Now(); time.Since(start) < time.Minute*30; time.Sleep(time.Second * 30) {

		//err := pageHasVideos(client, "sm35952346", 1) // Bilibili tag
		//if err != nil {
		//	log.Println(err)
		//	continue
		//}
		//
		//err = pageHasVideos(client, "被劝诱的石川", 1) // Bilibili channel
		//if err != nil {
		//	log.Println(err)
		//	continue
		//}

		// 		err = pageHasVideos(client, "風野灯織", 1) // nico channel
		// 		if err != nil {
		// 			log.Println(err)
		// 			continue
		// 		}

		err = pageHasVideos(client, "公式", 1) // there's some bizarre nico bug here where the tags keep switching on the video. very strange
		if err != nil {
			log.Println(err)
			continue
		}

		err = pageHasVideos(client, "しゅんなな", 8) // yt channel, should be 13 but several have ffmpeg errors. Sad!
		if err != nil {
			log.Println(err)
			continue
		}

		err = pageHasVideos(client, "琴葉姉妹のにゃーねこにゃー！", 1) // yt playlist, searching for neko neko nya nya video (lol)
		if err != nil {
			log.Println(err)
			continue
		}

		err = pageHasVideos(client, "NEW_GAME!", 1) // Nico mylist
		if err != nil {
			log.Println(err)
			continue
		}

		log.Println("All videos downloaded and transcoded successfully")
		return
	}

	log.Panic("Failed to download and transcode videos within 30 minutes")

}

func pageHasVideos(client *http.Client, tag string, count int) error {
	url := baseURL + fmt.Sprintf("/home?search=%s&category=upload_date&order=desc", tag)
	response, _ := client.Get(url)
	cont, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return err
	}

	c := strings.Count(string(cont), "VideoID")
	if c < count {
		return fmt.Errorf("page does not contain the right number of videos for %s. Found: %d", tag, c)
	}

	return nil
}

func makeArchiveRequest(client *http.Client, inpURL string) error {
	response, err := client.PostForm(baseURL+"/new-archive-request", url.Values{
		"url": {inpURL},
	})

	if err != nil {
		return err
	}

	if response.StatusCode != 200 {
		return fmt.Errorf("bad archival request response status: %d", response.StatusCode)
	}

	log.Printf("Made archival request for %s", inpURL)
	return nil
}

var redirectErr error = errors.New("don't redirect")

func authenticate(username, password string) (*http.Client, error) {
	jar, _ := cookiejar.New(nil)
	client := &http.Client{
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return redirectErr
		},

		Jar: jar,
	}

	req, err := http.NewRequest("POST", baseURL+"/login", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("username", username)
	req.Header.Add("password", password)

	response, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	// lol how do i check for an error here? :thinking:
	// if err != nil && err != redirectErr {
	// 	log.Panicf("failed to post with err: %s", err)
	// }

	if response.StatusCode != 200 {
		return nil, fmt.Errorf("bad auth status code: %d", response.StatusCode)
	}

	jwt := ""
	for _, cookie := range response.Cookies() {
		if cookie.Name == "jwt" {
			jwt = cookie.Value
		}
	}

	if jwt == "" {
		return nil, errors.New("JWT cookie not set")
	}

	return client, nil
}
