import moment from "moment";

export default function getFromNow(iso8601) {
  return moment(iso8601).fromNow();
}
