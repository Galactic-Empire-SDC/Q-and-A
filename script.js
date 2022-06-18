import http from 'k6/http';
import { sleep, check } from 'k6';
export const options = {
  stages: [
    { target: 1000, duration: '30s' },
  ],
};
//Below randomize the endpoints
export default function test() {

  const reviewTest = http.get(`http://127.0.0.1:3000/qa/questions?product_id=${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}`);
  check(reviewTest, { 'status was 200': (r) => r.status === 200 });
  sleep(1);
}

