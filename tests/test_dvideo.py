import pytest
from brownie import exceptions

from scripts.deploy import deploy
from scripts.helpful_scripts import get_account


def test_video_upload():
    dvideo = deploy()
    account = get_account()

    video_hash = '8743b52063cd84097a65d1633f5c74f5'
    video_title = 'my_video'

    # Empty video hash
    with pytest.raises(exceptions.VirtualMachineError):
        dvideo.uploadVideo('', video_title)

    # Empty video title
    with pytest.raises(exceptions.VirtualMachineError):
        dvideo.uploadVideo(video_hash, '')

    tx = dvideo.uploadVideo(video_hash, video_title)

    assert dvideo.videoCount() == 1
    assert dvideo.videos(1) == (1, video_hash, video_title, 0, account)

    assert tx.events['VideoUploaded']['id'] == 1
    assert tx.events['VideoUploaded']['hash'] == video_hash
    assert tx.events['VideoUploaded']['title'] == video_title
    assert tx.events['VideoUploaded']['author'] == account


def test_video_like():
    author = get_account()
    viewer = get_account(index=1)
    dvideo = deploy()

    video_hash = '8743b52063cd84097a65d1633f5c74f5'
    video_title = 'my_video'
    dvideo.uploadVideo(video_hash, video_title)

    with pytest.raises(exceptions.VirtualMachineError):
        dvideo.removeLike(1, {'from': viewer})

    tx = dvideo.addLike(1, {'from': viewer})
    assert dvideo.videoLikes(1, viewer)
    assert dvideo.videos(1)[3] == 1  # likes

    assert tx.events['VideoLikedStatusChanged']['videoId'] == 1
    assert tx.events['VideoLikedStatusChanged']['by'] == viewer
    assert tx.events['VideoLikedStatusChanged']['liked']

    with pytest.raises(exceptions.VirtualMachineError):
        dvideo.addLike(1, {'from': viewer})

    tx = dvideo.removeLike(1, {'from': viewer})
    assert not dvideo.videoLikes(1, viewer)
    assert dvideo.videos(1)[3] == 0  # likes

    assert tx.events['VideoLikedStatusChanged']['videoId'] == 1
    assert tx.events['VideoLikedStatusChanged']['by'] == viewer
    assert not tx.events['VideoLikedStatusChanged']['liked']
