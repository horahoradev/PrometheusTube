package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/cookiejar"
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

	for start := time.Now(); time.Since(start) < time.Minute*15; time.Sleep(time.Second * 30) {
		client, err = authenticate("admin", "admin")
		if err != nil {
			log.Errorf("Failed to login. Err: %s", err)
			continue
		}

		urls := []string{
			"https://www.youtube.com/watch?v=G8r3M-GxrdM", // koronba untitled by 10
			"https://www.youtube.com/watch?v=WVXm45UMS94", // 9 yen by 10
			// "https://www.youtube.com/watch?v=FrIiEuNPE38",
			// "https://www.youtube.com/watch?v=uwYyevRg1Ck",
			// "https://www.youtube.com/watch?v=SwPqaG9eYNY",
			// "https://www.youtube.com/watch?v=JzrxzyywS7Q",
			// "https://www.youtube.com/watch?v=yVSCXs9VjK4",
			// "https://www.youtube.com/watch?v=1dGSbmptjw8",
			// "https://www.youtube.com/watch?v=UZ4RP14aOJY",
			// "https://www.youtube.com/watch?v=1jVzaGb8PV4",
			// "https://www.youtube.com/watch?v=xRZ6SfwzLBA",
			// "https://www.youtube.com/watch?v=ziJLg8UJK7k",
			// "https://www.youtube.com/watch?v=5eFOdOadzP4",
			// "https://www.youtube.com/watch?v=BxfurKE41Ng",
			// "https://www.youtube.com/watch?v=U6RtFpM5cho",
			// "https://www.youtube.com/watch?v=bybssu7ZIS0",
			// "https://www.youtube.com/watch?v=WFfZ-VlZfvg",
			// "https://www.youtube.com/watch?v=jJhm9iDR9HA",
			// "https://www.youtube.com/watch?v=ZpyueT99038",
			// "https://www.youtube.com/watch?v=QZmxqSCYEpE",
			// "https://www.youtube.com/watch?v=9PUmuffh5Lo",
			// "https://www.youtube.com/watch?v=c8_Ctg_VvD0",
			// "https://www.youtube.com/watch?v=KbcLg_kMDf8",
			// "https://www.youtube.com/watch?v=4vJ5-LSb-_k",
			// "https://www.youtube.com/@subeteanatanoseidesu",
			// "https://www.youtube.com/watch?v=FnH1f7sCAHg",
			// "https://www.youtube.com/watch?v=Md3xdiX91Us",
			// "https://www.youtube.com/watch?v=BTLhF8rFJ04",
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

	// time.Sleep(time.Second * 60)
	err = approveVideoDownload(client, "1")
	if err != nil {
		log.Errorf("Failed to approve: %v", err)
	}
	err = approveVideoDownload(client, "2")
	if err != nil {
		log.Errorf("Failed to approve: %v", err)
	}

	log.Info("Authenticated and made archival requests")

	for start := time.Now(); time.Since(start) < time.Minute*30; time.Sleep(time.Second * 30) {

		err := pageHasVideos(client, "koronba", 1) // title
		if err != nil {
			log.Println(err)
			continue
		}

		err = pageHasVideos(client, "9 yen", 1) // title, case insensitive
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
	// god what are we doing
	cl, err := NewClientWithResponses("http://localhost:9000/api")
	if err != nil {
		return err
	}

	// breathtaking
	b := []byte(tag)
	c1 := []byte("undefined")

	resp, err := cl.VideosWithResponse(context.TODO(), &VideosParams{
		Search:     &b,
		Category:   &c1,
		ShowMature: true,
	})
	if err != nil {
		return err
	}

	if c := len(*resp.JSON200.Videos); c < count {
		return fmt.Errorf("page does not contain the right number of videos for %s. Found: %d", tag, c)
	}

	return nil
}

func approveVideoDownload(client *http.Client, id string) error {
	req, err := http.NewRequest("POST", baseURL+"/approve-download", nil)
	if err != nil {
		return err
	}

	req.Header.Add("videoID", id)
	if err != nil {
		return err
	}

	response, err := client.Do(req)
	if err != nil {
		return err
	}

	if response.StatusCode != 200 {
		return fmt.Errorf("bad video download approval: %d", response.StatusCode)
	}

	log.Printf("Approved download for %s", id)
	return nil
}

func makeArchiveRequest(client *http.Client, inpURL string) error {
	req, err := http.NewRequest("POST", baseURL+"/new-archive-request", nil)
	if err != nil {
		return err
	}

	req.Header.Add("url", inpURL)
	if err != nil {
		return err
	}

	response, err := client.Do(req)
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
